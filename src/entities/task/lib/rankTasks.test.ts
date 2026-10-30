import { describe, expect, it } from 'vitest'
import type { ITask } from '../model/ITask'
import { rankTasks, scoreTask, targetDifficulty, type StudentSignals } from './rankTasks'

const competency = (id: number) => ({ id, code: `c${id}`, name: { ru: `К${id}`, en: `C${id}` } })

const task = (overrides: Partial<ITask>): ITask => ({
	id: 1,
	title: 'Задание',
	description: '',
	expectedResult: null,
	criteria: null,
	difficulty: 1,
	status: 'published',
	ipTerms: 'open',
	requireRepository: true,
	maxParticipants: null,
	deadline: null,
	authorId: 'a',
	organizationId: 1,
	companyName: 'Компания',
	trackingCount: 0,
	tags: [],
	competencies: [],
	hasArchive: false,
	createdAt: '2026-10-01T00:00:00.000Z',
	publishedAt: '2026-10-01T00:00:00.000Z',
	isFavorite: false,
	...overrides,
})

const signals = (overrides: Partial<StudentSignals> = {}): StudentSignals => ({
	interestIds: new Set(),
	confirmedIds: new Set(),
	historyTags: new Set(),
	// Задания сложности 2 при целевой 3 — без бонуса и без штрафа: сложность не влияет на счёт
	targetDifficulty: 3,
	...overrides,
})

describe('targetDifficulty', () => {
	it('новичку — простые задания', () => {
		expect(targetDifficulty([])).toBe(1)
	})

	it('максимум из принятых при обычных оценках', () => {
		expect(
			targetDifficulty([
				{ difficulty: 1, score: 4 },
				{ difficulty: 2, score: 3 },
			]),
		).toBe(2)
	})

	it('на ступень выше при средней оценке от 4.5', () => {
		expect(targetDifficulty([{ difficulty: 2, score: 5 }])).toBe(3)
	})

	it('не выше максимальной сложности', () => {
		expect(targetDifficulty([{ difficulty: 3, score: 5 }])).toBe(3)
	})

	it('без оценок не повышает уровень', () => {
		expect(targetDifficulty([{ difficulty: 1, score: null }])).toBe(1)
	})
})

describe('scoreTask', () => {
	it('интерес весит больше подтверждённого навыка', () => {
		const interest = scoreTask(
			task({ competencies: [competency(1)], difficulty: 2 }),
			signals({ interestIds: new Set([1]) }),
		)
		const growth = scoreTask(
			task({ competencies: [competency(1)], difficulty: 2 }),
			signals({ confirmedIds: new Set([1]) }),
		)
		expect(interest.score).toBeGreaterThan(growth.score)
		expect(interest.reasons).toEqual([{ type: 'interest', competency: competency(1) }])
		expect(growth.reasons).toEqual([{ type: 'growth', competency: competency(1) }])
	})

	it('компетенция и в интересах, и подтверждена — считается один раз, как интерес', () => {
		const result = scoreTask(
			task({ competencies: [competency(1)], difficulty: 2 }),
			signals({ interestIds: new Set([1]), confirmedIds: new Set([1]) }),
		)
		expect(result.score).toBe(3)
		expect(result.reasons).toHaveLength(1)
	})

	it('учитывает не больше трёх совпавших тегов', () => {
		const result = scoreTask(
			task({ tags: ['a', 'b', 'c', 'd', 'e'], difficulty: 2 }),
			signals({ historyTags: new Set(['a', 'b', 'c', 'd', 'e']) }),
		)
		expect(result.score).toBe(3)
		expect(result.reasons).toEqual([{ type: 'similar', tags: ['a', 'b', 'c'] }])
	})

	it('подходящая сложность добавляет балл и причину', () => {
		const result = scoreTask(
			task({ competencies: [competency(1)], difficulty: 1 }),
			signals({ interestIds: new Set([1]), targetDifficulty: 1 }),
		)
		expect(result.score).toBe(4)
		expect(result.reasons.at(-1)).toEqual({ type: 'level' })
	})

	it('слишком сложное задание получает штраф', () => {
		const result = scoreTask(
			task({ competencies: [competency(1)], difficulty: 3 }),
			signals({ interestIds: new Set([1]), targetDifficulty: 1 }),
		)
		expect(result.score).toBe(1)
	})

	it('одна лишь подходящая сложность — не повод рекомендовать', () => {
		const result = scoreTask(task({ difficulty: 1 }), signals({ targetDifficulty: 1 }))
		expect(result).toEqual({ score: 0, reasons: [] })
	})
})

describe('rankTasks', () => {
	it('сортирует по счёту, отбрасывает нулевые и обрезает по лимиту', () => {
		const candidates = [
			task({ id: 1, tags: ['a'], difficulty: 2 }),
			task({ id: 2, competencies: [competency(1)], difficulty: 2 }),
			task({ id: 3, difficulty: 2 }),
			task({ id: 4, competencies: [competency(1)], tags: ['a'], difficulty: 2 }),
		]
		const result = rankTasks(
			candidates,
			signals({ interestIds: new Set([1]), historyTags: new Set(['a']), targetDifficulty: 2 }),
			2,
		)
		expect(result.map(item => item.task.id)).toEqual([4, 2])
	})

	it('при равном счёте выше более свежее задание', () => {
		const result = rankTasks(
			[
				task({ id: 1, tags: ['a'], publishedAt: '2026-10-01T00:00:00.000Z', difficulty: 2 }),
				task({ id: 2, tags: ['a'], publishedAt: '2026-10-05T00:00:00.000Z', difficulty: 2 }),
			],
			signals({ historyTags: new Set(['a']) }),
			10,
		)
		expect(result.map(item => item.task.id)).toEqual([2, 1])
	})
})
