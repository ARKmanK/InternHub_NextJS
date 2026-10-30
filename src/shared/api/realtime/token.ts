import { createHmac, timingSafeEqual } from 'node:crypto'

/**
 * Токен подключения к realtime-серверу: `base64url(payload).base64url(hmac)`.
 * Выдаёт его Next (пользователь уже вошёл), проверяет realtime-сервер по общему секрету —
 * ему не нужны ни база, ни Better Auth. Живёт минуту: нужен только для установки соединения.
 *
 * Модуль используется и приложением, и отдельным процессом realtime/server.ts,
 * поэтому зависит только от node:crypto.
 */
export type RealtimeTokenPayload = { sub: string; exp: number }

export const REALTIME_TOKEN_TTL_SECONDS = 60

const sign = (data: string, secret: string) =>
	createHmac('sha256', secret).update(data).digest('base64url')

export function createRealtimeToken(userId: string, secret: string, now = Date.now()) {
	const payload: RealtimeTokenPayload = {
		sub: userId,
		exp: Math.floor(now / 1000) + REALTIME_TOKEN_TTL_SECONDS,
	}
	const data = Buffer.from(JSON.stringify(payload)).toString('base64url')
	return `${data}.${sign(data, secret)}`
}

/** id пользователя или null, если подпись неверна или срок истёк. */
export function verifyRealtimeToken(token: string, secret: string, now = Date.now()) {
	const [data, signature] = token.split('.')
	if (!data || !signature) return null

	const expected = Buffer.from(sign(data, secret))
	const actual = Buffer.from(signature)
	if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) return null

	try {
		const payload = JSON.parse(Buffer.from(data, 'base64url').toString()) as RealtimeTokenPayload
		if (typeof payload.sub !== 'string' || typeof payload.exp !== 'number') return null
		return payload.exp * 1000 > now ? payload.sub : null
	} catch {
		return null
	}
}
