/** Итоговая оценка — пятибалльная шкала вуза (enum PracticeGrade в schema.prisma). */
export const PRACTICE_GRADES = ['excellent', 'good', 'satisfactory', 'unsatisfactory'] as const

export type PracticeGrade = (typeof PRACTICE_GRADES)[number]

export interface IPractice {
	id: number
	title: string
	description: string | null
	/** Даты без времени, ISO yyyy-mm-dd */
	startsAt: string
	endsAt: string
	teacherName: string
	studentCount: number
	taskCount: number
}

export type PracticeTaskResult = {
	status: 'draft' | 'submitted' | 'changes_requested' | 'accepted' | 'rejected'
	score: number | null
} | null

/** Таблица прогресса для преподавателя: студенты × задания. */
export interface IPracticeProgress {
	practice: IPractice
	tasks: { id: number; title: string; companyName: string; deadline: string | null }[]
	students: {
		id: string
		name: string
		group: string
		course: number
		grade: PracticeGrade | null
		gradeComment: string | null
		/** Результат по каждому заданию практики: ключ — id задания */
		results: Record<number, PracticeTaskResult>
	}[]
}

/** Практика глазами студента: задания со своими результатами и итоговая оценка. */
export interface IStudentPractice {
	practice: IPractice
	tasks: { id: number; title: string; deadline: string | null; result: PracticeTaskResult }[]
	grade: PracticeGrade | null
	gradeComment: string | null
}
