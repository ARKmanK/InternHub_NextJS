'use server'

import { db } from '@/shared/api'
import type { ActionResult } from '@/shared/lib/actionResult'
import { getCurrentUser } from '@/entities/user/index.server'

/** Отмечает уведомление прочитанным. Условие по userId — чужое уведомление отметить нельзя. */
export async function markNotificationReadAction(notificationId: number): Promise<ActionResult> {
	const user = await getCurrentUser()
	if (!user) return { ok: false, error: 'forbidden' }
	if (!Number.isInteger(notificationId)) return { ok: false, error: 'invalidData' }

	await db.notification.updateMany({
		where: { id: notificationId, userId: user.id, readAt: null },
		data: { readAt: new Date() },
	})
	return { ok: true, data: undefined }
}
