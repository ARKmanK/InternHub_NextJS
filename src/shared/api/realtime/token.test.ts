import { describe, expect, it } from 'vitest'
import { createRealtimeToken, verifyRealtimeToken } from './token'

const secret = 'test-secret'
const now = Date.UTC(2026, 9, 30, 12)

describe('realtime token', () => {
	it('подписанный токен возвращает id пользователя', () => {
		expect(verifyRealtimeToken(createRealtimeToken('user-1', secret, now), secret, now)).toBe(
			'user-1',
		)
	})

	it('через минуту токен недействителен', () => {
		const token = createRealtimeToken('user-1', secret, now)
		expect(verifyRealtimeToken(token, secret, now + 61_000)).toBeNull()
	})

	it('другой секрет — отказ', () => {
		expect(verifyRealtimeToken(createRealtimeToken('user-1', secret, now), 'other', now)).toBeNull()
	})

	it('подменённый пользователь — отказ', () => {
		const [, signature] = createRealtimeToken('user-1', secret, now).split('.')
		const forged = Buffer.from(JSON.stringify({ sub: 'admin', exp: now / 1000 + 60 })).toString(
			'base64url',
		)
		expect(verifyRealtimeToken(`${forged}.${signature}`, secret, now)).toBeNull()
	})

	it.each(['', 'abc', 'a.b.c', '.'])('мусор «%s» — отказ', token => {
		expect(verifyRealtimeToken(token, secret, now)).toBeNull()
	})
})
