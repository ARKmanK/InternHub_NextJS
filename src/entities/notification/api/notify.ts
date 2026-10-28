import { db, UserRole, type Prisma } from '@/shared/api'

type NotificationContent = {
	title: string
	body: string
	link?: string
}

// TODO(этап 4): тексты уведомлений — на языке получателя (сейчас на русском)

/** Создаёт уведомление каждому из пользователей. Можно передать транзакцию, чтобы уведомление создалось вместе с действием. */
export async function notifyUsers(
	userIds: string[],
	{ title, body, link }: NotificationContent,
	client: Prisma.TransactionClient = db,
) {
	if (userIds.length === 0) return
	await client.notification.createMany({
		data: userIds.map(userId => ({ userId, title, body, link: link ?? null })),
	})
}

/** Уведомление всем администраторам (новое задание на модерации и т.п.). */
export async function notifyAdmins(
	content: NotificationContent,
	client: Prisma.TransactionClient = db,
) {
	const admins = await client.user.findMany({
		where: { role: UserRole.ADMIN },
		select: { id: true },
	})
	await notifyUsers(
		admins.map(admin => admin.id),
		content,
		client,
	)
}
