import 'server-only'
import { headers } from 'next/headers'

/**
 * Простое ограничение частоты запросов в памяти процесса (скользящее окно).
 *
 * Зачем своё: встроенный лимит Better Auth работает только для HTTP-маршрутов /api/auth/*,
 * а вход и регистрация у нас идут через server actions, которые вызывают auth.api.* напрямую.
 *
 * Ограничение: счётчики живут в памяти одного процесса. Для одного сервера (наш случай) этого достаточно;
 * при нескольких экземплярах приложения счётчики нужно хранить общими, например в Redis.
 */
const hits = new Map<string, number[]>()

export type RateLimitRule = {
	/** Сколько попыток разрешено за окно */
	limit: number
	/** Длина окна в секундах */
	windowSeconds: number
}

/** IP клиента из заголовков прокси (nginx выставляет X-Forwarded-For / X-Real-IP). */
export const getClientIp = async () => {
	const headerList = await headers()
	return (
		headerList.get('x-forwarded-for')?.split(',')[0]?.trim() ??
		headerList.get('x-real-ip') ??
		'unknown'
	)
}

/** true — запрос разрешён, false — лимит исчерпан. Ключ — например `login:${ip}`. */
export const checkRateLimit = (key: string, { limit, windowSeconds }: RateLimitRule) => {
	const now = Date.now()
	const windowStart = now - windowSeconds * 1000
	const recent = (hits.get(key) ?? []).filter(time => time > windowStart)

	if (recent.length >= limit) {
		hits.set(key, recent)
		return false
	}

	recent.push(now)
	hits.set(key, recent)
	return true
}
