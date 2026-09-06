export interface ITask {
	id: number
	trackingNumber: number
	title: string
	description: string
	difficulty: number
	companyName: string
	deadline?: string
	employerId: number
	createdAt: string
	zipFileURL?: string
}
