import { db } from '@/shared/api'
import type { INotification, NotificationParams } from '../model/INotification'

/** Непрочитанные уведомления пользователя, новые сверху. Вызывается только на сервере. */
export async function getUnreadNotifications(userId: string): Promise<INotification[]> {
	const rows = await db.notification.findMany({
		where: { userId, readAt: null },
		orderBy: { createdAt: 'desc' },
		take: 20,
	})

	return rows.map(row => ({
		id: row.id,
		type: row.type,
		// Json из базы: берём только известные строковые поля
		params: pickParams(row.params),
		link: row.link,
		isRead: row.readAt !== null,
		createdAt: row.createdAt.toISOString(),
	}))
}

const pickParams = (value: unknown): NotificationParams => {
	if (!value || typeof value !== 'object') return {}
	const source = value as Record<string, unknown>
	const text = (key: string) => (typeof source[key] === 'string' ? source[key] : undefined)
	return {
		taskTitle: text('taskTitle'),
		studentName: text('studentName'),
		comment: text('comment'),
	}
}
