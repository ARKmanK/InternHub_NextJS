'use server'

import { revalidatePath } from 'next/cache'
import { db, TaskStatus } from '@/shared/api'
import { routes } from '@/shared/config'
import type { ActionResult } from '@/shared/lib/actionResult'
import { changeTaskStatus } from '@/entities/task/index.server'
import { getCurrentUser } from '@/entities/user/index.server'

/**
 * Автор закрывает приём заявок и решений. Задание остаётся видимым (история и портфолио),
 * а решения, отправленные на доработку, ещё можно доделать.
 */
export async function closeTaskAction(taskId: number): Promise<ActionResult> {
	const user = await getCurrentUser()
	if (user?.role !== 'employer' || !Number.isInteger(taskId))
		return { ok: false, error: 'forbidden' }

	const task = await db.task.findUnique({ where: { id: taskId }, select: { authorId: true } })
	if (!task || task.authorId !== user.id) return { ok: false, error: 'forbidden' }

	const closed = await db.$transaction(tx =>
		changeTaskStatus(tx, {
			taskId,
			from: TaskStatus.PUBLISHED,
			to: TaskStatus.CLOSED,
			changedById: user.id,
		}),
	)
	if (!closed) return { ok: false, error: 'invalidData' }

	revalidatePath(routes.task(taskId))
	revalidatePath(routes.profile())
	revalidatePath(routes.home())
	return { ok: true, data: undefined }
}
