import { db, UserRole } from '@/shared/api'

export type StudentProfile = {
	id: string
	name: string
	group: string
	course: number
}

/** Данные студента для портфолио (без почты). Вызывается только на сервере. */
export async function getStudentProfile(userId: string): Promise<StudentProfile | null> {
	const user = await db.user.findFirst({
		where: { id: userId, role: UserRole.STUDENT },
		select: { id: true, studentProfile: true },
	})
	const profile = user?.studentProfile
	if (!profile) return null

	return {
		id: user.id,
		name: `${profile.firstName} ${profile.lastName}`,
		group: profile.group,
		course: profile.course,
	}
}
