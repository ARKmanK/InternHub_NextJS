'use server'

import { revalidatePath } from 'next/cache'
import { db, TaskStatus } from '@/shared/api'
import { routes } from '@/shared/config'
import type { ActionResult } from '@/shared/lib/actionResult'
import { notifyUsers } from '@/entities/notification/index.server'
import { changeTaskStatus } from '@/entities/task/index.server'
import { getCurrentUser } from '@/entities/user/index.server'

export type ModerationDecision = 'approve' | 'reject'

/**
 * Решение администратора по заданию на модерации:
 * approve — публикация, reject — возврат автору в черновик с обязательным комментарием.
 */
export async function moderateTaskAction(
	taskId: number,
	decision: ModerationDecision,
	comment = '',
): Promise<ActionResult> {
	const user = await getCurrentUser()
	if (user?.role !== 'admin') return { ok: false, error: 'forbidden' }

	const reason = comment.trim()
	if (!Number.isInteger(taskId) || (decision === 'reject' && reason.length < 5)) {
		return { ok: false, error: 'invalidData' }
	}

	const task = await db.task.findUnique({
		where: { id: taskId },
		select: { title: true, authorId: true, publishedAt: true },
	})
	if (!task) return { ok: false, error: 'invalidData' }

	const approved = decision === 'approve'

	const changed = await db.$transaction(async tx => {
		const ok = await changeTaskStatus(tx, {
			taskId,
			from: TaskStatus.MODERATION,
			to: approved ? TaskStatus.PUBLISHED : TaskStatus.DRAFT,
			changedById: user.id,
			comment: reason || null,
			// Дата первой публикации сохраняется при повторной модерации после правок
			data: approved && !task.publishedAt ? { publishedAt: new Date() } : undefined,
		})
		if (ok) {
			await notifyUsers(
				[task.authorId],
				{
					type: approved ? 'TASK_PUBLISHED' : 'TASK_RETURNED',
					params: { taskTitle: task.title, ...(reason && { comment: reason }) },
					link: routes.task(taskId),
				},
				tx,
			)
		}
		return ok
	})
	// Задание уже не на модерации (решение принял другой администратор)
	if (!changed) return { ok: false, error: 'invalidData' }

	revalidatePath(routes.profile())
	revalidatePath(routes.home())
	revalidatePath(routes.task(taskId))
	return { ok: true, data: undefined }
}
