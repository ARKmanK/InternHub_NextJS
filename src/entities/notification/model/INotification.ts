/** Виды уведомлений — совпадают с enum NotificationType в schema.prisma. */
export const NOTIFICATION_TYPES = [
	'TASK_ON_MODERATION',
	'TASK_EDITED',
	'TASK_PUBLISHED',
	'TASK_RETURNED',
	'APPLICATION_RECEIVED',
	'APPLICATION_ACCEPTED',
	'APPLICATION_DECLINED',
	'SOLUTION_RECEIVED',
	'SOLUTION_RESUBMITTED',
	'SOLUTION_ACCEPTED',
	'SOLUTION_CHANGES_REQUESTED',
	'SOLUTION_REJECTED',
	'ORGANIZATION_VERIFIED',
	'ORGANIZATION_REJECTED',
] as const

export type NotificationType = (typeof NOTIFICATION_TYPES)[number]

/** Подстановки в текст уведомления. Сам текст собирается при показе — на языке читателя. */
export type NotificationParams = {
	taskTitle?: string
	studentName?: string
	comment?: string
}

export interface INotification {
	id: number
	type: NotificationType
	params: NotificationParams
	link: string | null
	isRead: boolean
	createdAt: string
}
