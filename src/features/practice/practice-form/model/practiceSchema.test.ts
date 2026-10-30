import { describe, expect, it } from 'vitest'
import { practiceSchema, toDbDate } from './practiceSchema'

const valid = { title: 'Практика', description: '', startsAt: '2026-11-01', endsAt: '2026-11-30' }

describe('practiceSchema', () => {
	it('принимает корректную практику', () => {
		expect(practiceSchema.safeParse(valid).success).toBe(true)
	})

	it('окончание в день начала — допустимо', () => {
		expect(practiceSchema.safeParse({ ...valid, endsAt: valid.startsAt }).success).toBe(true)
	})

	it('окончание раньше начала — ошибка dateRange на поле endsAt', () => {
		const result = practiceSchema.safeParse({ ...valid, endsAt: '2026-10-01' })
		expect(result.success).toBe(false)
		expect(result.error?.issues[0]).toMatchObject({ message: 'dateRange', path: ['endsAt'] })
	})

	it('не дата — ошибка date', () => {
		const result = practiceSchema.safeParse({ ...valid, startsAt: '01.11.2026' })
		expect(result.error?.issues[0]?.message).toBe('date')
	})
})

describe('toDbDate', () => {
	it('полночь UTC — день не съезжает из-за часового пояса', () => {
		expect(toDbDate('2026-11-01').toISOString()).toBe('2026-11-01T00:00:00.000Z')
	})
})
