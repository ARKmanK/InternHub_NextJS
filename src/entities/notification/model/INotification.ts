export interface INotification {
	id: number
	title: string
	description: string
	link: string | null
	isRead: boolean
	createdAt: string
}
