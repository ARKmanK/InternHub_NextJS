import type { CompetencyLevel } from './ICompetency'

/**
 * Уровень по сумме сложностей принятых заданий: одно сложное задание весит как три простых.
 * Пороги подобраны так, чтобы «продвинутый» требовал нескольких заданий, а не одного удачного.
 */
export const LEVEL_THRESHOLDS = { confident: 3, advanced: 6 } as const

export function competencyLevel(points: number): CompetencyLevel {
	if (points >= LEVEL_THRESHOLDS.advanced) return 'advanced'
	if (points >= LEVEL_THRESHOLDS.confident) return 'confident'
	return 'basic'
}
