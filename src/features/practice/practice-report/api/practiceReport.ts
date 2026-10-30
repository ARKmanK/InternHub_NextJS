import 'server-only'
import { getTranslations } from 'next-intl/server'
import { getPracticeProgress } from '@/entities/practice/index.server'
import type { IUser } from '@/entities/user'
import { toCsv } from '../lib/csv'

/** Ведомость практики: студенты × задания, итоговая оценка. null — практика не своя или не найдена. */
export async function buildPracticeReport(practiceId: number, user: IUser | null) {
	if (user?.role !== 'teacher') return null
	const progress = await getPracticeProgress(practiceId, user.id)
	if (!progress) return null

	const locale = user.locale
	const [t, tStatus, tPractice] = await Promise.all([
		getTranslations({ locale, namespace: 'PracticeReport' }),
		getTranslations({ locale, namespace: 'SubmissionStatus' }),
		getTranslations({ locale, namespace: 'Practice' }),
	])

	const header = [
		t('student'),
		t('group'),
		t('course'),
		...progress.tasks.map(task => task.title),
		t('grade'),
		t('comment'),
	]
	const rows = progress.students.map(student => [
		student.name,
		student.group,
		student.course || '',
		...progress.tasks.map(task => {
			const result = student.results[task.id]
			if (!result) return t('notStarted')
			const status = tStatus(result.status)
			return result.score === null ? status : `${status} (${result.score})`
		}),
		student.grade ? tPractice(student.grade) : tPractice('noGrade'),
		student.gradeComment ?? '',
	])

	return { csv: toCsv([header, ...rows]), fileName: `practice-${practiceId}.csv` }
}
