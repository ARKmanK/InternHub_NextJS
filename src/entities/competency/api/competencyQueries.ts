import { db, SubmissionStatus, TaskDifficulty } from '@/shared/api'
import { competencyLevel } from '../model/competencyLevel'
import type { ICompetency, IStudentCompetency } from '../model/ICompetency'
import { competencySelect, toCompetencyDto } from './competencyMapper'

const difficultyPoints = {
	[TaskDifficulty.EASY]: 1,
	[TaskDifficulty.MEDIUM]: 2,
	[TaskDifficulty.HARD]: 3,
} as const satisfies Record<TaskDifficulty, number>

// Все функции вызываются только на сервере.

/** Весь справочник: варианты в форме задания и в выборе интересов. */
export async function getCompetencies(): Promise<ICompetency[]> {
	const rows = await db.competency.findMany({
		select: competencySelect,
		orderBy: { nameRu: 'asc' },
	})
	return rows.map(toCompetencyDto)
}

/** id компетенций, которые студент отметил как интересные. */
export async function getStudentInterestIds(studentId: string): Promise<number[]> {
	const profile = await db.studentProfile.findUnique({
		where: { userId: studentId },
		select: { interests: { select: { id: true } } },
	})
	return profile?.interests.map(item => item.id) ?? []
}

type Accumulator = { competency: ICompetency; points: number; scores: number[]; count: number }

/**
 * Профиль компетенций: по каждой — сколько принятых решений её подтверждают,
 * их суммарная сложность и средняя оценка. Подтверждает работодатель, принимая решение;
 * условия ИС не важны — NDA скрывает результат, но не сам факт навыка.
 */
export async function getStudentCompetencies(studentId: string): Promise<IStudentCompetency[]> {
	const submissions = await db.submission.findMany({
		where: { studentId, status: SubmissionStatus.ACCEPTED },
		select: {
			score: true,
			task: { select: { difficulty: true, competencies: { select: competencySelect } } },
		},
	})

	const byId = new Map<number, Accumulator>()
	for (const { score, task } of submissions) {
		for (const row of task.competencies) {
			const entry = byId.get(row.id) ?? {
				competency: toCompetencyDto(row),
				points: 0,
				scores: [],
				count: 0,
			}
			entry.count += 1
			entry.points += difficultyPoints[task.difficulty]
			if (score !== null) entry.scores.push(score)
			byId.set(row.id, entry)
		}
	}

	return [...byId.values()]
		.map(entry => ({
			competency: entry.competency,
			level: competencyLevel(entry.points),
			tasksCount: entry.count,
			points: entry.points,
			averageScore: entry.scores.length
				? entry.scores.reduce((sum, value) => sum + value, 0) / entry.scores.length
				: null,
		}))
		.sort((a, b) => b.points - a.points || a.competency.name.ru.localeCompare(b.competency.name.ru))
}
