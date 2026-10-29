import { db, UserRole, type Prisma } from '@/shared/api'
import type { NotificationParams, NotificationType } from '../model/INotification'

type NotificationEvent = {
	type: NotificationType
	params?: NotificationParams
	link?: string
}

/**
 * Создаёт уведомление каждому из пользователей. Сохраняются тип и параметры, а не текст:
 * текст соберётся при показе на языке получателя.
 * Можно передать транзакцию, чтобы уведомление создалось вместе с действием.
 */
export async function notifyUsers(
	userIds: string[],
	{ type, params = {}, link }: NotificationEvent,
	client: Prisma.TransactionClient = db,
) {
	if (userIds.length === 0) return
	await client.notification.createMany({
		data: userIds.map(userId => ({ userId, type, params, link: link ?? null })),
	})
}

/** Уведомление всем администраторам (новое задание на модерации и т.п.). */
export async function notifyAdmins(
	event: NotificationEvent,
	client: Prisma.TransactionClient = db,
) {
	const admins = await client.user.findMany({
		where: { role: UserRole.ADMIN },
		select: { id: true },
	})
	await notifyUsers(
		admins.map(admin => admin.id),
		event,
		client,
	)
}
