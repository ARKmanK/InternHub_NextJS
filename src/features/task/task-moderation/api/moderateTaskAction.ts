'use server'

import { notImplemented, type ActionResult } from '@/shared/lib/actionResult'

export type ModerationDecision = 'approve' | 'reject'

/**
 * TODO(этап 3): только для admin. approve → статус 'published', reject → 'draft' с комментарием;
 * записать решение в историю модерации и отправить уведомление работодателю.
 */
export async function moderateTaskAction(
	_taskId: number,
	_decision: ModerationDecision,
	_comment?: string,
): Promise<ActionResult> {
	return notImplemented()
}
