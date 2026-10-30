'use server'

import { z } from 'zod'
import { db, Prisma } from '@/shared/api'
import type { ActionResult } from '@/shared/lib/actionResult'
import { checkRateLimit } from '@/shared/lib/rateLimit'
import { directKey } from '@/entities/conversation'
import { getCurrentUser } from '@/entities/user/index.server'

// Новых собеседников в час: защита от рассылки всем подряд
const START_LIMIT = { limit: 20, windowSeconds: 3600 }

/**
 * Личный чат пары пользователей: существующий или новый. Уникальный directKey не даст создать
 * второй чат, даже если оба нажмут «Написать» одновременно, — тогда берём уже созданный.
 */
async function openDirectConversation(userId: string, peerId: string) {
	const key = directKey(userId, peerId)
	const existing = await db.conversation.findUnique({
		where: { directKey: key },
		select: { id: true },
	})
	if (existing) return existing.id

	try {
		const created = await db.conversation.create({
			data: { directKey: key, members: { create: [{ userId }, { userId: peerId }] } },
			select: { id: true },
		})
		return created.id
	} catch (error) {
		if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
			const raced = await db.conversation.findUniqueOrThrow({
				where: { directKey: key },
				select: { id: true },
			})
			return raced.id
		}
		throw error
	}
}

async function start(peerId: string | null): Promise<ActionResult<{ conversationId: number }>> {
	const user = await getCurrentUser()
	if (!user) return { ok: false, error: 'forbidden' }
	if (!peerId) return { ok: false, error: 'userNotFound' }
	if (peerId === user.id) return { ok: false, error: 'invalidData' }

	// Открыть уже существующий чат можно без лимита — ограничиваем только новые
	const existing = await db.conversation.findUnique({
		where: { directKey: directKey(user.id, peerId) },
		select: { id: true },
	})
	if (existing) return { ok: true, data: { conversationId: existing.id } }

	if (!checkRateLimit(`chat-start:${user.id}`, START_LIMIT)) {
		return { ok: false, error: 'tooManyRequests' }
	}
	return { ok: true, data: { conversationId: await openDirectConversation(user.id, peerId) } }
}

/** «Написать» со страницы задания, портфолио, практики — собеседник известен по id. */
export async function startConversationAction(peerId: string) {
	if (typeof peerId !== 'string') return start(null)
	const peer = await db.user.findUnique({ where: { id: peerId }, select: { id: true } })
	return start(peer?.id ?? null)
}

const emailSchema = z.email()

/**
 * Новый чат по почте — например, с однокурсником для командного задания.
 * Только точное совпадение: каталога пользователей с поиском по имени нет — это персональные данные.
 */
export async function startConversationByEmailAction(email: string) {
	const parsed = emailSchema.safeParse(typeof email === 'string' ? email.trim().toLowerCase() : '')
	if (!parsed.success) return { ok: false, error: 'invalidData' } as const
	const peer = await db.user.findUnique({
		where: { email: parsed.data },
		select: { id: true, emailVerified: true },
	})
	return start(peer?.emailVerified ? peer.id : null)
}
