export const USER_ROLES = ['student', 'employer', 'teacher', 'admin'] as const

export type UserRole = (typeof USER_ROLES)[number]

export type OrganizationStatus = 'pending' | 'verified' | 'rejected' | 'blocked'

export interface IUser {
	/** Строковый id (cuid) — формат, который использует Better Auth. */
	id: string
	email: string
	name: string
	role: UserRole
	/** Язык интерфейса и писем */
	locale: 'ru' | 'en'
	/** Только у работодателя: его организация и статус её проверки. */
	organization?: { id: number; name: string; status: OrganizationStatus }
}
