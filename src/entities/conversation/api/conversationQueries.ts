import { db, type Prisma } from '@/shared/api'
import { roleToDto } from '@/entities/user/@x/conversation'
import {
	MESSAGES_PAGE_SIZE,
	type IChatPeer,
	type IConversationPreview,
	type IMessage,
} from '../model/IConversation'

// Все функции вызываются только на сервере. Каждая проверяет, что пользователь — участник чата.

const peerSelect = {
	id: true,
	name: true,
	role: true,
	studentProfile: { select: { firstName: true, lastName: true, group: true } },
	employerProfile: { select: { organization: { select: { name: true } } } },
} satisfies Prisma.UserSelect

type PeerRow = Prisma.UserGetPayload<{ select: typeof peerSelect }>

export const toPeerDto = (row: PeerRow): IChatPeer => ({
	id: row.id,
	name: row.studentProfile
		? `${row.studentProfile.firstName} ${row.studentProfile.lastName}`
		: row.name,
	role: roleToDto[row.role],
	subtitle: row.studentProfile?.group ?? row.employerProfile?.organization.name ?? null,
})

export const toMessageDto = (row: {
	id: number
	conversationId: number
	authorId: string
	text: string
	createdAt: Date
}): IMessage => ({ ...row, createdAt: row.createdAt.toISOString() })

const EPOCH = new Date(0)

/**
 * Непрочитанные сообщения по чатам: чужие сообщения новее отметки «прочитано до».
 * Один запрос groupBy на все чаты пользователя.
 */
async function countUnread(
	userId: string,
	memberships: { conversationId: number; lastReadAt: Date | null }[],
) {
	if (memberships.length === 0) return new Map<number, number>()
	const groups = await db.message.groupBy({
		by: ['conversationId'],
		where: {
			authorId: { not: userId },
			OR: memberships.map(item => ({
				conversationId: item.conversationId,
				createdAt: { gt: item.lastReadAt ?? EPOCH },
			})),
		},
		_count: { _all: true },
	})
	return new Map(groups.map(group => [group.conversationId, group._count._all]))
}

/** Чаты пользователя: свежие сверху, с последним сообщением и числом непрочитанных. */
export async function getConversations(userId: string): Promise<IConversationPreview[]> {
	const memberships = await db.conversationMember.findMany({
		where: { userId },
		select: {
			conversationId: true,
			lastReadAt: true,
			conversation: {
				select: {
					members: { where: { userId: { not: userId } }, select: { user: { select: peerSelect } } },
					messages: {
						select: { authorId: true, text: true, createdAt: true },
						orderBy: { id: 'desc' },
						take: 1,
					},
				},
			},
		},
		orderBy: { conversation: { lastMessageAt: { sort: 'desc', nulls: 'last' } } },
	})
	const unread = await countUnread(userId, memberships)

	return memberships.flatMap(({ conversationId, conversation }) => {
		const peer = conversation.members[0]?.user
		// Собеседник удалил аккаунт — чат без второй стороны не показываем
		if (!peer) return []
		const last = conversation.messages[0]
		return [
			{
				id: conversationId,
				peer: toPeerDto(peer),
				lastMessage: last ? { ...last, createdAt: last.createdAt.toISOString() } : null,
				unreadCount: unread.get(conversationId) ?? 0,
			},
		]
	})
}

/** Всего непрочитанных сообщений — для значка в шапке. */
export async function getUnreadMessagesCount(userId: string): Promise<number> {
	const memberships = await db.conversationMember.findMany({
		where: { userId },
		select: { conversationId: true, lastReadAt: true },
	})
	const unread = await countUnread(userId, memberships)
	return [...unread.values()].reduce((sum, count) => sum + count, 0)
}

/** Чат глазами участника: собеседник. null — чата нет или пользователь в нём не участвует. */
export async function getConversation(conversationId: number, userId: string) {
	const conversation = await db.conversation.findFirst({
		where: { id: conversationId, members: { some: { userId } } },
		select: {
			id: true,
			members: { where: { userId: { not: userId } }, select: { user: { select: peerSelect } } },
		},
	})
	const peer = conversation?.members[0]?.user
	if (!conversation || !peer) return null
	return { id: conversation.id, peer: toPeerDto(peer) }
}

/**
 * Страница истории: последние сообщения или те, что раньше `beforeId`. Порядок — от старых к новым.
 * null — пользователь не участник чата.
 */
export async function getMessages(
	conversationId: number,
	userId: string,
	beforeId?: number,
): Promise<{ messages: IMessage[]; hasMore: boolean } | null> {
	const isMember = await db.conversationMember.findUnique({
		where: { conversationId_userId: { conversationId, userId } },
		select: { userId: true },
	})
	if (!isMember) return null

	const rows = await db.message.findMany({
		where: { conversationId, ...(beforeId && { id: { lt: beforeId } }) },
		select: { id: true, conversationId: true, authorId: true, text: true, createdAt: true },
		orderBy: { id: 'desc' },
		take: MESSAGES_PAGE_SIZE + 1,
	})
	const hasMore = rows.length > MESSAGES_PAGE_SIZE
	return { messages: rows.slice(0, MESSAGES_PAGE_SIZE).reverse().map(toMessageDto), hasMore }
}
