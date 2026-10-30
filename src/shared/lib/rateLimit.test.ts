import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { checkRateLimit } from './rateLimit'

describe('checkRateLimit', () => {
	beforeEach(() => vi.useFakeTimers())
	afterEach(() => vi.useRealTimers())

	const rule = { limit: 3, windowSeconds: 60 }

	it('пропускает до лимита и блокирует сверх него', () => {
		const key = 'test:limit'
		expect([1, 2, 3, 4].map(() => checkRateLimit(key, rule))).toEqual([true, true, true, false])
	})

	it('окно скользящее: старые попытки перестают считаться', () => {
		const key = 'test:window'
		for (let i = 0; i < 3; i++) checkRateLimit(key, rule)
		expect(checkRateLimit(key, rule)).toBe(false)

		vi.advanceTimersByTime(61_000)
		expect(checkRateLimit(key, rule)).toBe(true)
	})

	it('счётчики разных ключей независимы', () => {
		for (let i = 0; i < 3; i++) checkRateLimit('test:a', rule)
		expect(checkRateLimit('test:b', rule)).toBe(true)
	})
})
