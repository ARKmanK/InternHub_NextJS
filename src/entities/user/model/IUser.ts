export const USER_ROLES = ['student', 'employer', 'admin'] as const

export type UserRole = (typeof USER_ROLES)[number]

export interface IUser {
	id: number
	email: string
	role: UserRole
	firstName?: string
	lastName?: string
	studentGroup?: string
	course?: number
	companyName?: string
	createdAt: string
}
