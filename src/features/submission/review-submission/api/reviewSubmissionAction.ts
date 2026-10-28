'use server'

import { notImplemented, type ActionResult } from '@/shared/lib/actionResult'

export type ReviewDecision = 'accept' | 'request_changes' | 'reject'

/**
 * TODO(этап 3): только владелец задания. Сменить статус решения
 * (accepted / changes_requested / rejected), сохранить комментарий, записать историю статусов,
 * отправить уведомление студенту и revalidatePath страницы задания.
 */
export async function reviewSubmissionAction(
	_submissionId: number,
	_decision: ReviewDecision,
	_comment: string,
): Promise<ActionResult> {
	return notImplemented()
}
