import { UserRole } from '@/shared/api'
import type { IUser } from '../model/IUser'

export const roleToDto = {
	[UserRole.STUDENT]: 'student',
	[UserRole.EMPLOYER]: 'employer',
	[UserRole.TEACHER]: 'teacher',
	[UserRole.ADMIN]: 'admin',
} as const satisfies Record<UserRole, IUser['role']>
