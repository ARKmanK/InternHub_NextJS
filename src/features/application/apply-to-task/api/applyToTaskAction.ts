'use server'

import { revalidatePath } from 'next/cache'
import { ApplicationStatus, db, TaskStatus } from '@/shared/api'
import { routes } from '@/shared/config'
import type { ActionResult } from '@/shared/lib/actionResult'
import { notifyUsers } from '@/entities/notification/index.server'
import { getCurrentUser } from '@/entities/user/index.server'

/** Студент берётся за задание. Решение можно будет сдать после того, как работодатель примет заявку. */
export async function applyToTaskAction(taskId: number, message: string): Promise<ActionResult> {
	const user = await getCurrentUser()
	if (user?.role !== 'student') return { ok: false, error: 'forbidden' }

	const text = message.trim()
	if (!Number.isInteger(taskId) || text.length > 1000) return { ok: false, error: 'invalidData' }

	const task = await db.task.findFirst({
		where: { id: taskId, status: TaskStatus.PUBLISHED },
		select: { title: true, authorId: true },
	})
	if (!task) return { ok: false, error: 'invalidData' }

	const existing = await db.application.findUnique({
		where: { taskId_studentId: { taskId, studentId: user.id } },
		select: { status: true },
	})
	// Повторно подать можно только отозванную заявку; отклонённую — нет
	if (existing && existing.status !== ApplicationStatus.WITHDRAWN) {
		return { ok: false, error: 'invalidData' }
	}

	await db.$transaction(async tx => {
		await tx.application.upsert({
			where: { taskId_studentId: { taskId, studentId: user.id } },
			create: { taskId, studentId: user.id, message: text || null },
			update: { status: ApplicationStatus.PENDING, message: text || null },
		})
		await notifyUsers(
			[task.authorId],
			{
				type: 'APPLICATION_RECEIVED',
				params: { taskTitle: task.title, studentName: user.name },
				link: routes.task(taskId),
			},
			tx,
		)
	})

	revalidatePath(routes.task(taskId))
	return { ok: true, data: undefined }
}
