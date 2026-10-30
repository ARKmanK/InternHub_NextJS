'use server'

import { afterCommit, db, publish, transaction } from '@/shared/api'
import type { ActionResult } from '@/shared/lib/actionResult'
import { checkRateLimit } from '@/shared/lib/rateLimit'
import { MESSAGE_MAX_LENGTH, type IMessage } from '@/entities/conversation'
import { toMessageDto } from '@/entities/conversation/index.server'
import { getCurrentUser } from '@/entities/user/index.server'

const SEND_LIMIT = { limit: 30, windowSeconds: 60 }

/**
 * Отправка сообщения. Только через server action, не через WebSocket: здесь проверяются
 * участие в чате, длина и частота, а сообщение сохраняется в БД. Realtime лишь разносит
 * событие по открытым вкладкам — включая другие вкладки автора.
 */
export async function sendMessageAction(
	conversationId: number,
	rawText: string,
): Promise<ActionResult<IMessage>> {
	const user = await getCurrentUser()
	if (!user) return { ok: false, error: 'forbidden' }

	const text = typeof rawText === 'string' ? rawText.trim() : ''
	if (!Number.isInteger(conversationId) || !text || text.length > MESSAGE_MAX_LENGTH) {
		return { ok: false, error: 'invalidData' }
	}

	const members = await db.conversationMember.findMany({
		where: { conversationId },
		select: { userId: true },
	})
	const memberIds = members.map(member => member.userId)
	if (!memberIds.includes(user.id)) return { ok: false, error: 'forbidden' }

	if (!checkRateLimit(`chat-send:${user.id}`, SEND_LIMIT)) {
		return { ok: false, error: 'tooManyRequests' }
	}

	const message = await transaction(async tx => {
		const created = await tx.message.create({
			data: { conversationId, authorId: user.id, text },
			select: { id: true, conversationId: true, authorId: true, text: true, createdAt: true },
		})
		await tx.conversation.update({
			where: { id: conversationId },
			data: { lastMessageAt: created.createdAt },
		})
		// Своё сообщение автор уже «прочитал»
		await tx.conversationMember.update({
			where: { conversationId_userId: { conversationId, userId: user.id } },
			data: { lastReadAt: created.createdAt },
		})
		const dto = toMessageDto(created)
		afterCommit(tx, () =>
			publish(memberIds, {
				type: 'message',
				conversationId,
				message: { id: dto.id, authorId: dto.authorId, text: dto.text, createdAt: dto.createdAt },
			}),
		)
		return dto
	})

	return { ok: true, data: message }
}
