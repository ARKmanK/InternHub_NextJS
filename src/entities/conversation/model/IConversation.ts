import type { UserRole } from '@/entities/user/@x/conversation'

/** Максимальная длина сообщения (как VarChar в schema.prisma). */
export const MESSAGE_MAX_LENGTH = 4000

/** Сколько сообщений грузить за раз: последние при открытии, дальше — «показать раньше». */
export const MESSAGES_PAGE_SIZE = 50

/** Собеседник: имя и чем он занимается — чтобы было понятно, с кем переписка. */
export interface IChatPeer {
	id: string
	name: string
	role: UserRole
	/** Организация работодателя или группа студента */
	subtitle: string | null
}

export interface IMessage {
	id: number
	conversationId: number
	authorId: string
	text: string
	createdAt: string
}

/** Строка в списке чатов. */
export interface IConversationPreview {
	id: number
	peer: IChatPeer
	lastMessage: Pick<IMessage, 'authorId' | 'text' | 'createdAt'> | null
	unreadCount: number
}
