import type { ICompetency } from '@/entities/competency/@x/task'
import type { ITask, TaskDifficulty } from '../model/ITask'

/**
 * Почему задание рекомендовано. Рекомендации объяснимые: студент видит причину,
 * а не «чёрный ящик», — и может повлиять на неё, поменяв интересы.
 */
export type RecommendationReason =
	| { type: 'interest'; competency: ICompetency }
	| { type: 'growth'; competency: ICompetency }
	| { type: 'similar'; tags: string[] }
	| { type: 'level' }

export interface IRecommendedTask {
	task: ITask
	score: number
	reasons: RecommendationReason[]
}

/** Что известно о студенте. Собирается из БД в getRecommendedTasks. */
export type StudentSignals = {
	/** Компетенции, которые студент отметил как интересные */
	interestIds: ReadonlySet<number>
	/** Компетенции, уже подтверждённые принятыми решениями */
	confirmedIds: ReadonlySet<number>
	/** Теги заданий, с которыми студент уже имел дело: избранное, заявки, решения */
	historyTags: ReadonlySet<string>
	/** Сложность, которая сейчас по силам студенту */
	targetDifficulty: TaskDifficulty
}

/**
 * Веса признаков. Интерес весит больше всего — это явное желание студента;
 * опыт и похожие теги — неявные сигналы из истории.
 */
export const RECOMMENDATION_WEIGHTS = {
	interest: 3,
	growth: 1,
	similarTag: 1,
	/** Не больше стольких совпавших тегов: иначе задание с длинным списком тегов побеждает всегда */
	maxSimilarTags: 3,
	level: 1,
	/** Штраф за задание сложнее текущего уровня */
	tooHard: -2,
} as const

/**
 * Целевая сложность по истории: новичку — простые задания; дальше — максимум из принятых,
 * а при высоких оценках (в среднем от 4.5) — на ступень выше.
 */
export function targetDifficulty(accepted: { difficulty: TaskDifficulty; score: number | null }[]) {
	if (accepted.length === 0) return 1
	const max = Math.max(...accepted.map(item => item.difficulty))
	const scores = accepted.flatMap(item => (item.score === null ? [] : [item.score]))
	const average = scores.length ? scores.reduce((sum, value) => sum + value, 0) / scores.length : 0
	return Math.min(3, average >= 4.5 ? max + 1 : max) as TaskDifficulty
}

/** Оценка одного задания: сумма весов сработавших признаков и их список для объяснения. */
export function scoreTask(task: ITask, signals: StudentSignals) {
	const w = RECOMMENDATION_WEIGHTS
	const reasons: RecommendationReason[] = []
	let score = 0

	for (const competency of task.competencies) {
		if (signals.interestIds.has(competency.id)) {
			score += w.interest
			reasons.push({ type: 'interest', competency })
		} else if (signals.confirmedIds.has(competency.id)) {
			score += w.growth
			reasons.push({ type: 'growth', competency })
		}
	}

	const similar = task.tags.filter(tag => signals.historyTags.has(tag)).slice(0, w.maxSimilarTags)
	if (similar.length > 0) {
		score += similar.length * w.similarTag
		reasons.push({ type: 'similar', tags: similar })
	}

	// Сложность сама по себе не повод рекомендовать — только уточняет порядок
	const hasContentReason = reasons.length > 0
	if (task.difficulty === signals.targetDifficulty) {
		score += w.level
		if (hasContentReason) reasons.push({ type: 'level' })
	} else if (task.difficulty > signals.targetDifficulty) {
		score += w.tooHard
	}

	return { score: hasContentReason ? score : 0, reasons }
}

/**
 * Ранжирование кандидатов. Чистая функция без обращений к БД — её легко проверить тестами
 * и описать в пояснительной записке. При равном счёте выше более свежее задание.
 */
export function rankTasks(
	candidates: ITask[],
	signals: StudentSignals,
	limit: number,
): IRecommendedTask[] {
	return candidates
		.map(task => ({ task, ...scoreTask(task, signals) }))
		.filter(item => item.score > 0)
		.sort(
			(a, b) =>
				b.score - a.score || (b.task.publishedAt ?? '').localeCompare(a.task.publishedAt ?? ''),
		)
		.slice(0, limit)
}
