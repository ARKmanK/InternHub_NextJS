export const USER_ROLES = ['student', 'employer', 'admin'] as const

export type UserRole = (typeof USER_ROLES)[number]

export interface IUser {
	/** Строковый id (cuid) — формат, который использует Better Auth. */
	id: string
	email: string
	name: string
	role: UserRole
	/** Есть только у работодателя. */
	organizationId?: number
}
