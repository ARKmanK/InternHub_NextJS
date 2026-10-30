'use server'

import { revalidatePath } from 'next/cache'
import { ApplicationStatus, db, TaskStatus, transaction } from '@/shared/api'
import { routes } from '@/shared/config'
import type { ActionResult } from '@/shared/lib/actionResult'
import { notifyUsers } from '@/entities/notification/index.server'
import { getCurrentUser } from '@/entities/user/index.server'

export type ApplicationDecision = 'accept' | 'decline'

/** Автор задания принимает или отклоняет заявку. Принять можно, только пока есть свободные места. */
export async function reviewApplicationAction(
	applicationId: number,
	decision: ApplicationDecision,
): Promise<ActionResult> {
	const user = await getCurrentUser()
	if (user?.role !== 'employer' || !Number.isInteger(applicationId)) {
		return { ok: false, error: 'forbidden' }
	}

	const application = await db.application.findUnique({
		where: { id: applicationId },
		select: {
			status: true,
			studentId: true,
			task: {
				select: { id: true, title: true, authorId: true, status: true, maxParticipants: true },
			},
		},
	})
	const task = application?.task
	if (!application || !task || task.authorId !== user.id) return { ok: false, error: 'forbidden' }
	if (application.status !== ApplicationStatus.PENDING) return { ok: false, error: 'invalidData' }

	const accept = decision === 'accept'
	if (accept && task.status !== TaskStatus.PUBLISHED) return { ok: false, error: 'invalidData' }

	const result = await transaction(async tx => {
		if (accept && task.maxParticipants !== null) {
			const accepted = await tx.application.count({
				where: { taskId: task.id, status: ApplicationStatus.ACCEPTED },
			})
			if (accepted >= task.maxParticipants) return 'full' as const
		}

		// Условие по статусу — защита от двойного нажатия
		const { count } = await tx.application.updateMany({
			where: { id: applicationId, status: ApplicationStatus.PENDING },
			data: { status: accept ? ApplicationStatus.ACCEPTED : ApplicationStatus.DECLINED },
		})
		if (count === 0) return 'stale' as const

		await notifyUsers(
			[application.studentId],
			{
				type: accept ? 'APPLICATION_ACCEPTED' : 'APPLICATION_DECLINED',
				params: { taskTitle: task.title },
				link: routes.task(task.id),
			},
			tx,
		)
		return 'ok' as const
	})

	if (result === 'full') return { ok: false, error: 'noSlots' }
	if (result === 'stale') return { ok: false, error: 'invalidData' }

	revalidatePath(routes.task(task.id))
	return { ok: true, data: undefined }
}
