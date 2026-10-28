'use server'

import { revalidatePath } from 'next/cache'
import { db, TaskStatus } from '@/shared/api'
import { routes } from '@/shared/config'
import type { ActionResult } from '@/shared/lib/actionResult'
import { getCurrentUser } from '@/entities/user/index.server'

/**
 * Избранное хранится в БД (раньше — в redux-persist, то есть только в одном браузере).
 * Число «отслеживают» на карточке считается по этим записям, отдельного счётчика нет.
 */
export async function toggleFavoriteAction(
	taskId: number,
	isFavorite: boolean,
): Promise<ActionResult> {
	const user = await getCurrentUser()
	if (user?.role !== 'student') return { ok: false, error: 'forbidden' }
	if (!Number.isInteger(taskId)) return { ok: false, error: 'invalidData' }

	const key = { studentId_taskId: { studentId: user.id, taskId } }

	if (isFavorite) {
		// Добавить в избранное можно только видимое студенту задание
		const task = await db.task.findFirst({
			where: { id: taskId, status: { in: [TaskStatus.PUBLISHED, TaskStatus.CLOSED] } },
			select: { id: true },
		})
		if (!task) return { ok: false, error: 'invalidData' }
		await db.favorite.upsert({
			where: key,
			create: { studentId: user.id, taskId },
			update: {},
		})
	} else {
		await db.favorite.deleteMany({ where: { studentId: user.id, taskId } })
	}

	revalidatePath(routes.profile())
	revalidatePath(routes.task(taskId))
	return { ok: true, data: undefined }
}
