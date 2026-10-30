import 'server-only'
import type { RealtimeEvent } from '@/shared/lib/realtime'

const PUBLISH_TIMEOUT_MS = 2000

/**
 * Отправить событие пользователям через realtime-сервер (POST /publish с общим секретом).
 *
 * Не ждёт ответа и не бросает ошибок: realtime — улучшение, а не основа. Если сервер недоступен
 * или не настроен (REALTIME_INTERNAL_URL пуст), всё работает как раньше: колокольчик опрашивает
 * сервер, а сообщения подгрузятся при обновлении страницы.
 */
export function publish(userIds: string[], event: RealtimeEvent) {
	const url = process.env.REALTIME_INTERNAL_URL
	const secret = process.env.REALTIME_SECRET
	if (!url || !secret || userIds.length === 0) return

	fetch(`${url}/publish`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${secret}` },
		body: JSON.stringify({ userIds: [...new Set(userIds)], event }),
		signal: AbortSignal.timeout(PUBLISH_TIMEOUT_MS),
	})
		.then(response => {
			if (!response.ok) console.warn(`realtime publish: ${response.status}`)
		})
		.catch((error: Error) => console.warn(`realtime publish: ${error.message}`))
}
