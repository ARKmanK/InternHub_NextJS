import { createRealtimeToken } from '@/shared/api'
import { getCurrentUser } from '@/entities/user/index.server'

/**
 * Токен для подключения к realtime-серверу и его адрес. Адрес отдаётся здесь, а не через
 * NEXT_PUBLIC_*: так один и тот же собранный образ работает на любом домене.
 * 503 — realtime не настроен; клиент тогда не подключается и живёт на опросе.
 */
export async function GET() {
	const secret = process.env.REALTIME_SECRET
	const url = process.env.REALTIME_PUBLIC_URL
	if (!secret || !url) return new Response(null, { status: 503 })

	const user = await getCurrentUser()
	if (!user) return new Response(null, { status: 401 })

	return Response.json(
		{ token: createRealtimeToken(user.id, secret), url },
		{ headers: { 'Cache-Control': 'private, no-store' } },
	)
}
