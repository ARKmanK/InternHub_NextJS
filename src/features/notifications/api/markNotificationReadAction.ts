'use server'

import { notImplemented, type ActionResult } from '@/shared/lib/actionResult'

/** TODO(этап 4): пометить уведомление текущего пользователя прочитанным. */
export async function markNotificationReadAction(_notificationId: number): Promise<ActionResult> {
	return notImplemented()
}
