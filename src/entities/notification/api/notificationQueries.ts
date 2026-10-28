import type { INotification } from '../model/INotification'

// Вызывается только на сервере. TODO(этап 4): Prisma, уведомления создаются по событиям.
export async function getUnreadNotifications(_userId: number): Promise<INotification[]> {
	return []
}
