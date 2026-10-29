import { db } from '@/shared/api'

/**
 * Практика, если она принадлежит преподавателю, иначе null.
 * Общая проверка прав для всех действий с практикой: чужую практику не изменить, даже зная её id.
 */
export async function findTeacherPractice(practiceId: number, teacherId: string) {
	if (!Number.isInteger(practiceId)) return null
	return db.practice.findFirst({
		where: { id: practiceId, teacherId },
		select: { id: true, title: true },
	})
}
