import { db, PracticeGrade, SubmissionStatus, TaskStatus, type Prisma } from '@/shared/api'
import type {
	IPractice,
	IPracticeProgress,
	IStudentPractice,
	PracticeTaskResult,
} from '../model/IPractice'

export const gradeToDto = {
	[PracticeGrade.EXCELLENT]: 'excellent',
	[PracticeGrade.GOOD]: 'good',
	[PracticeGrade.SATISFACTORY]: 'satisfactory',
	[PracticeGrade.UNSATISFACTORY]: 'unsatisfactory',
} as const satisfies Record<PracticeGrade, NonNullable<IStudentPractice['grade']>>

const submissionStatusToDto = {
	[SubmissionStatus.DRAFT]: 'draft',
	[SubmissionStatus.SUBMITTED]: 'submitted',
	[SubmissionStatus.CHANGES_REQUESTED]: 'changes_requested',
	[SubmissionStatus.ACCEPTED]: 'accepted',
	[SubmissionStatus.REJECTED]: 'rejected',
} as const satisfies Record<SubmissionStatus, NonNullable<PracticeTaskResult>['status']>

const practiceSelect = {
	id: true,
	title: true,
	description: true,
	startsAt: true,
	endsAt: true,
	teacher: { select: { name: true } },
	_count: { select: { students: true, tasks: true } },
} satisfies Prisma.PracticeSelect

type PracticeRow = Prisma.PracticeGetPayload<{ select: typeof practiceSelect }>

const toDate = (date: Date) => date.toISOString().slice(0, 10)

const toPracticeDto = (row: PracticeRow): IPractice => ({
	id: row.id,
	title: row.title,
	description: row.description,
	startsAt: toDate(row.startsAt),
	endsAt: toDate(row.endsAt),
	teacherName: row.teacher.name,
	studentCount: row._count.students,
	taskCount: row._count.tasks,
})

/** Результаты студентов по заданиям одной выборкой: ключ `${studentId}:${taskId}`. */
const getResults = async (studentIds: string[], taskIds: number[]) => {
	if (studentIds.length === 0 || taskIds.length === 0) return new Map<string, PracticeTaskResult>()
	const submissions = await db.submission.findMany({
		where: { studentId: { in: studentIds }, taskId: { in: taskIds } },
		select: { studentId: true, taskId: true, status: true, score: true },
	})
	return new Map(
		submissions.map(row => [
			`${row.studentId}:${row.taskId}`,
			{ status: submissionStatusToDto[row.status], score: row.score },
		]),
	)
}

// Все функции вызываются только на сервере.

export async function getTeacherPractices(teacherId: string): Promise<IPractice[]> {
	const rows = await db.practice.findMany({
		where: { teacherId },
		select: practiceSelect,
		orderBy: { startsAt: 'desc' },
	})
	return rows.map(toPracticeDto)
}

/** Таблица прогресса. null — практики нет или она чужая (преподаватель видит только свои). */
export async function getPracticeProgress(
	practiceId: number,
	teacherId: string,
): Promise<IPracticeProgress | null> {
	const row = await db.practice.findFirst({
		where: { id: practiceId, teacherId },
		select: {
			...practiceSelect,
			tasks: {
				select: {
					task: {
						select: {
							id: true,
							title: true,
							deadline: true,
							organization: { select: { name: true } },
						},
					},
				},
				orderBy: { addedAt: 'asc' },
			},
			students: {
				select: {
					grade: true,
					gradeComment: true,
					student: { select: { id: true, name: true, studentProfile: true } },
				},
			},
		},
	})
	if (!row) return null

	const tasks = row.tasks.map(({ task }) => ({
		id: task.id,
		title: task.title,
		companyName: task.organization.name,
		deadline: task.deadline ? toDate(task.deadline) : null,
	}))
	const results = await getResults(
		row.students.map(item => item.student.id),
		tasks.map(task => task.id),
	)

	const students = row.students
		.map(({ student, grade, gradeComment }) => ({
			id: student.id,
			name: student.studentProfile
				? `${student.studentProfile.lastName} ${student.studentProfile.firstName}`
				: student.name,
			group: student.studentProfile?.group ?? '',
			course: student.studentProfile?.course ?? 0,
			grade: grade ? gradeToDto[grade] : null,
			gradeComment,
			results: Object.fromEntries(
				tasks.map(task => [task.id, results.get(`${student.id}:${task.id}`) ?? null]),
			),
		}))
		// Как в ведомости: по группе, затем по фамилии
		.sort((a, b) => a.group.localeCompare(b.group) || a.name.localeCompare(b.name))

	return { practice: toPracticeDto(row), tasks, students }
}

/** Практики студента с его результатами по каждому заданию. */
export async function getStudentPractices(studentId: string): Promise<IStudentPractice[]> {
	const rows = await db.practiceStudent.findMany({
		where: { studentId },
		select: {
			grade: true,
			gradeComment: true,
			practice: {
				select: {
					...practiceSelect,
					tasks: {
						select: { task: { select: { id: true, title: true, deadline: true } } },
						orderBy: { addedAt: 'asc' },
					},
				},
			},
		},
		orderBy: { practice: { startsAt: 'desc' } },
	})

	const taskIds = rows.flatMap(row => row.practice.tasks.map(({ task }) => task.id))
	const results = await getResults([studentId], taskIds)

	return rows.map(row => ({
		practice: toPracticeDto(row.practice),
		tasks: row.practice.tasks.map(({ task }) => ({
			id: task.id,
			title: task.title,
			deadline: task.deadline ? toDate(task.deadline) : null,
			result: results.get(`${studentId}:${task.id}`) ?? null,
		})),
		grade: row.grade ? gradeToDto[row.grade] : null,
		gradeComment: row.gradeComment,
	}))
}

/** Задания, которые можно добавить в практику: опубликованные и ещё не добавленные. */
export async function getAvailableTasksForPractice(practiceId: number) {
	return db.task.findMany({
		where: { status: TaskStatus.PUBLISHED, practices: { none: { practiceId } } },
		select: { id: true, title: true, organization: { select: { name: true } } },
		orderBy: { publishedAt: 'desc' },
	})
}
