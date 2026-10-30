'use server'

import { revalidatePath } from 'next/cache'
import { db } from '@/shared/api'
import { routes } from '@/shared/config'
import type { ActionResult } from '@/shared/lib/actionResult'
import { getCurrentUser } from '@/entities/user/index.server'

/**
 * Отметить чат прочитанным до текущего момента. Обновлять запись нужно, только если
 * пользователь — участник: updateMany по паре (чат, пользователь) другого и не заденет.
 */
export async function markConversationReadAction(conversationId: number): Promise<ActionResult> {
	const user = await getCurrentUser()
	if (!user) return { ok: false, error: 'forbidden' }
	if (!Number.isInteger(conversationId)) return { ok: false, error: 'invalidData' }

	const { count } = await db.conversationMember.updateMany({
		where: { conversationId, userId: user.id },
		data: { lastReadAt: new Date() },
	})
	if (count === 0) return { ok: false, error: 'forbidden' }

	// Счётчики непрочитанных в списке чатов и в шапке
	revalidatePath(routes.messages(), 'layout')
	return { ok: true, data: undefined }
}
