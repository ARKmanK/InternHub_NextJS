import type { Locale } from '@/shared/i18n'

/** Компетенция из справочника. Название хранится на обоих языках — выбирает интерфейс. */
export interface ICompetency {
	id: number
	code: string
	name: Record<Locale, string>
}

export const COMPETENCY_LEVELS = ['basic', 'confident', 'advanced'] as const

export type CompetencyLevel = (typeof COMPETENCY_LEVELS)[number]

/** Подтверждённая компетенция студента — вычисляется из принятых решений, отдельно не хранится. */
export interface IStudentCompetency {
	competency: ICompetency
	level: CompetencyLevel
	/** Сколько принятых решений подтверждают компетенцию */
	tasksCount: number
	/** Сумма сложностей этих заданий (1–3 за каждое) */
	points: number
	averageScore: number | null
}

/** Максимум компетенций у одного задания: больше — уже не «фокус», а перечисление всего подряд. */
export const MAX_TASK_COMPETENCIES = 5
