import { db, SubmissionStatus, TaskStatus } from '@/shared/api'
import { rankTasks, targetDifficulty, type IRecommendedTask } from '../lib/rankTasks'
import { difficultyToDto, taskSelect, toTaskDto } from './taskMapper'

/** Сколько свежих заданий рассматривать: рекомендации считаются в памяти, базу не нагружаем. */
const CANDIDATES_LIMIT = 200

/**
 * Рекомендации студенту: опубликованные задания с открытым сроком, с которыми он ещё
 * не взаимодействовал (нет в избранном, нет заявки и решения). Вызывается только на сервере.
 */
export async function getRecommendedTasks(
	studentId: string,
	limit = 6,
): Promise<IRecommendedTask[]> {
	const touched = {
		OR: [
			{ favorites: { some: { studentId } } },
			{ applications: { some: { studentId } } },
			{ submissions: { some: { studentId } } },
		],
	}

	const [profile, accepted, history, candidates] = await Promise.all([
		db.studentProfile.findUnique({
			where: { userId: studentId },
			select: { interests: { select: { id: true } } },
		}),
		db.submission.findMany({
			where: { studentId, status: SubmissionStatus.ACCEPTED },
			select: {
				score: true,
				task: { select: { difficulty: true, competencies: { select: { id: true } } } },
			},
		}),
		db.task.findMany({ where: touched, select: { tags: { select: { name: true } } } }),
		db.task.findMany({
			where: {
				status: TaskStatus.PUBLISHED,
				OR: [{ deadline: null }, { deadline: { gte: new Date() } }],
				NOT: touched,
			},
			select: taskSelect(studentId),
			orderBy: { publishedAt: 'desc' },
			take: CANDIDATES_LIMIT,
		}),
	])

	return rankTasks(
		candidates.map(toTaskDto),
		{
			interestIds: new Set(profile?.interests.map(item => item.id)),
			confirmedIds: new Set(
				accepted.flatMap(item => item.task.competencies.map(competency => competency.id)),
			),
			historyTags: new Set(history.flatMap(task => task.tags.map(tag => tag.name))),
			targetDifficulty: targetDifficulty(
				accepted.map(item => ({
					difficulty: difficultyToDto[item.task.difficulty],
					score: item.score,
				})),
			),
		},
		limit,
	)
}
