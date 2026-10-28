import { db } from '@/shared/api'
import type { INotification } from '../model/INotification'

/** Непрочитанные уведомления пользователя, новые сверху. Вызывается только на сервере. */
export async function getUnreadNotifications(userId: string): Promise<INotification[]> {
	const rows = await db.notification.findMany({
		where: { userId, readAt: null },
		orderBy: { createdAt: 'desc' },
		take: 20,
	})

	return rows.map(row => ({
		id: row.id,
		title: row.title,
		description: row.body,
		link: row.link,
		isRead: row.readAt !== null,
		createdAt: row.createdAt.toISOString(),
	}))
}
