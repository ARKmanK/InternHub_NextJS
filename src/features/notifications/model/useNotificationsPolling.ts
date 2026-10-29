'use client'

import { useEffect, useState } from 'react'
import type { INotification } from '@/entities/notification'

const POLL_INTERVAL_MS = 30_000

/**
 * Список непрочитанных уведомлений, который обновляется сам:
 * раз в 30 секунд и сразу при возвращении на вкладку. Пока вкладка скрыта — запросов нет.
 *
 * Почему опрос, а не push (WebSocket/SSE): для уведомлений задержка в десятки секунд не критична,
 * а push требует отдельного долгоживущего соединения с базой. Переход на push — смена этого хука,
 * остальной код не изменится.
 */
export function useNotificationsPolling(initial: INotification[]) {
	const [notifications, setNotifications] = useState(initial)
	const [previousInitial, setPreviousInitial] = useState(initial)

	// Сервер прислал свежий список (переход по странице, revalidatePath) — берём его
	if (initial !== previousInitial) {
		setPreviousInitial(initial)
		setNotifications(initial)
	}

	useEffect(() => {
		let cancelled = false

		const refresh = async () => {
			if (document.visibilityState !== 'visible') return
			try {
				const response = await fetch('/api/notifications', { cache: 'no-store' })
				if (response.ok && !cancelled) setNotifications(await response.json())
			} catch {
				// Сеть недоступна — попробуем в следующий раз
			}
		}

		const timer = setInterval(refresh, POLL_INTERVAL_MS)
		document.addEventListener('visibilitychange', refresh)
		return () => {
			cancelled = true
			clearInterval(timer)
			document.removeEventListener('visibilitychange', refresh)
		}
	}, [])

	const remove = (id: number) => setNotifications(list => list.filter(item => item.id !== id))

	return { notifications, remove }
}
