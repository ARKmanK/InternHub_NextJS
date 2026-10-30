'use server'

import { revalidatePath } from 'next/cache'
import { PracticeGrade, transaction } from '@/shared/api'
import { routes } from '@/shared/config'
import type { ActionResult } from '@/shared/lib/actionResult'
import { notifyUsers } from '@/entities/notification/index.server'
import type { PracticeGrade as PracticeGradeDto } from '@/entities/practice'
import { findTeacherPractice } from '@/entities/practice/index.server'
import { getCurrentUser } from '@/entities/user/index.server'

const gradeFromDto = {
	excellent: PracticeGrade.EXCELLENT,
	good: PracticeGrade.GOOD,
	satisfactory: PracticeGrade.SATISFACTORY,
	unsatisfactory: PracticeGrade.UNSATISFACTORY,
} as const satisfies Record<PracticeGradeDto, PracticeGrade>

/** Итоговая оценка студенту за практику — подтверждение образовательного результата преподавателем. */
export async function gradeStudentAction(
	practiceId: number,
	studentId: string,
	grade: PracticeGradeDto,
	comment: string,
): Promise<ActionResult> {
	const user = await getCurrentUser()
	if (user?.role !== 'teacher') return { ok: false, error: 'forbidden' }

	const practice = await findTeacherPractice(practiceId, user.id)
	if (!practice) return { ok: false, error: 'forbidden' }

	const text = comment.trim()
	if (!(grade in gradeFromDto) || text.length > 2000) return { ok: false, error: 'invalidData' }

	const changed = await transaction(async tx => {
		const { count } = await tx.practiceStudent.updateMany({
			where: { practiceId, studentId },
			data: { grade: gradeFromDto[grade], gradeComment: text || null, gradedAt: new Date() },
		})
		if (count > 0) {
			await notifyUsers(
				[studentId],
				{
					type: 'PRACTICE_GRADED',
					params: { practiceTitle: practice.title, ...(text && { comment: text }) },
					link: routes.profile(),
				},
				tx,
			)
		}
		return count > 0
	})
	// Студента нет в этой практике
	if (!changed) return { ok: false, error: 'invalidData' }

	revalidatePath(routes.practice(practiceId))
	return { ok: true, data: undefined }
}
