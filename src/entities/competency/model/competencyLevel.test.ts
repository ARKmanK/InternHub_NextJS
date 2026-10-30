import { describe, expect, it } from 'vitest'
import { competencyLevel } from './competencyLevel'

describe('competencyLevel', () => {
	it.each([
		[1, 'basic'],
		[2, 'basic'],
		[3, 'confident'],
		[5, 'confident'],
		[6, 'advanced'],
		[12, 'advanced'],
	] as const)('%i баллов — %s', (points, level) => {
		expect(competencyLevel(points)).toBe(level)
	})

	it('одно сложное задание даёт уверенный уровень, но не продвинутый', () => {
		expect(competencyLevel(3)).toBe('confident')
	})
})
