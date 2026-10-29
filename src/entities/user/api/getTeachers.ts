import { db, UserRole } from '@/shared/api'

export type TeacherSummary = {
	id: string
	name: string
	email: string
	/** Задал пароль по ссылке из приглашения */
	isActive: boolean
}

/** Преподаватели для панели администратора. Вызывается только на сервере. */
export async function getTeachers(): Promise<TeacherSummary[]> {
	const rows = await db.user.findMany({
		where: { role: UserRole.TEACHER },
		select: {
			id: true,
			name: true,
			email: true,
			accounts: { where: { providerId: 'credential' }, select: { id: true } },
		},
		orderBy: { name: 'asc' },
	})
	return rows.map(row => ({
		id: row.id,
		name: row.name,
		email: row.email,
		isActive: row.accounts.length > 0,
	}))
}
