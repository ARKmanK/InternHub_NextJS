'use server'

import { revalidatePath } from 'next/cache'
import { db, SubmissionStatus } from '@/shared/api'
import { routes } from '@/shared/config'
import type { ActionResult } from '@/shared/lib/actionResult'
import { notifyUsers } from '@/entities/notification/index.server'
import { changeSubmissionStatus } from '@/entities/submission/index.server'
import { getCurrentUser } from '@/entities/user/index.server'

export type ReviewDecision = 'accept' | 'request_changes' | 'reject'

const decisionToStatus = {
	accept: SubmissionStatus.ACCEPTED,
	request_changes: SubmissionStatus.CHANGES_REQUESTED,
	reject: SubmissionStatus.REJECTED,
} as const

const notificationType = {
	accept: 'SOLUTION_ACCEPTED',
	request_changes: 'SOLUTION_CHANGES_REQUESTED',
	reject: 'SOLUTION_REJECTED',
} as const

/**
 * Проверка решения автором задания.
 * Принять — с оценкой 1–5 (комментарий по желанию); вернуть на доработку и отклонить — только с комментарием,
 * иначе студенту непонятно, что исправлять.
 */
export async function reviewSubmissionAction(
	submissionId: number,
	decision: ReviewDecision,
	comment: string,
	score: number | null,
): Promise<ActionResult> {
	const user = await getCurrentUser()
	if (user?.role !== 'employer' || !Number.isInteger(submissionId)) {
		return { ok: false, error: 'forbidden' }
	}
	if (!(decision in decisionToStatus)) return { ok: false, error: 'invalidData' }

	const text = comment.trim()
	const validScore = score !== null && Number.isInteger(score) && score >= 1 && score <= 5
	if (decision === 'accept' && !validScore) return { ok: false, error: 'invalidData' }
	if (decision !== 'accept' && text.length < 5) return { ok: false, error: 'invalidData' }
	if (text.length > 2000) return { ok: false, error: 'invalidData' }

	const submission = await db.submission.findUnique({
		where: { id: submissionId },
		select: { studentId: true, task: { select: { id: true, title: true, authorId: true } } },
	})
	if (!submission || submission.task.authorId !== user.id) return { ok: false, error: 'forbidden' }

	const { task } = submission

	const changed = await db.$transaction(async tx => {
		const ok = await changeSubmissionStatus(tx, {
			submissionId,
			from: SubmissionStatus.SUBMITTED,
			to: decisionToStatus[decision],
			changedById: user.id,
			comment: text || null,
			data: {
				reviewComment: text || null,
				reviewedAt: new Date(),
				score: decision === 'accept' ? score : null,
			},
		})
		if (ok) {
			await notifyUsers(
				[submission.studentId],
				{
					type: notificationType[decision],
					// Комментарий проверяющего — это текст пользователя, он не переводится и хранится как есть
					params: { taskTitle: task.title, ...(text && { comment: text }) },
					link: routes.task(task.id),
				},
				tx,
			)
		}
		return ok
	})
	// Решение уже проверено (или студент его ещё не отправил)
	if (!changed) return { ok: false, error: 'invalidData' }

	revalidatePath(routes.task(task.id))
	return { ok: true, data: undefined }
}
