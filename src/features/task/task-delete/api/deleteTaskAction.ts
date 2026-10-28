'use server'

import { revalidatePath } from 'next/cache'
import { db, storage, TaskStatus } from '@/shared/api'
import { routes } from '@/shared/config'
import type { ActionResult } from '@/shared/lib/actionResult'
import { changeTaskStatus } from '@/entities/task/index.server'
import { getCurrentUser } from '@/entities/user/index.server'

/**
 * Удаление задания автором.
 * Если по заданию уже есть заявки или решения, удалять его нельзя — это история студентов
 * (портфолио, отчёты по практике). Такое задание переводится в архив.
 */
export async function deleteTaskAction(taskId: number): Promise<ActionResult> {
	const user = await getCurrentUser()
	if (user?.role !== 'employer' || !Number.isInteger(taskId))
		return { ok: false, error: 'forbidden' }

	const task = await db.task.findUnique({
		where: { id: taskId },
		select: {
			authorId: true,
			status: true,
			archiveKey: true,
			_count: { select: { applications: true, submissions: true } },
		},
	})
	if (!task || task.authorId !== user.id) return { ok: false, error: 'forbidden' }

	const hasParticipants = task._count.applications > 0 || task._count.submissions > 0

	if (hasParticipants) {
		if (task.status === TaskStatus.ARCHIVED) return { ok: true, data: undefined }
		const archived = await db.$transaction(tx =>
			changeTaskStatus(tx, {
				taskId,
				from: task.status,
				to: TaskStatus.ARCHIVED,
				changedById: user.id,
				comment: 'Удалено автором',
			}),
		)
		if (!archived) return { ok: false, error: 'invalidData' }
	} else {
		// Связанные записи (история, теги, избранное) удалятся каскадом
		await db.task.delete({ where: { id: taskId } })
		if (task.archiveKey) await storage.delete(task.archiveKey)
	}

	revalidatePath(routes.profile())
	revalidatePath(routes.home())
	return { ok: true, data: undefined }
}
