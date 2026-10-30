'use client'

import { useEffect, useEffectEvent, useState } from 'react'
import { useRealtimeConnected, useRealtimeEvent } from '@/shared/lib/realtime'
import type { INotification } from '@/entities/notification'

const POLL_INTERVAL_MS = 30_000

/**
 * Список непрочитанных уведомлений, который обновляется сам.
 *
 * Основной путь — push: realtime-сервер присылает событие «notification», и список сразу
 * перезапрашивается. Запасной — опрос раз в 30 секунд, только пока WebSocket не подключён
 * (realtime не настроен или недоступен). При возвращении на вкладку и после переподключения
 * список тоже обновляется: события за время разрыва могли потеряться.
 */
export function useLiveNotifications(initial: INotification[]) {
	const [notifications, setNotifications] = useState(initial)
	const [previousInitial, setPreviousInitial] = useState(initial)
	const connected = useRealtimeConnected()

	// Сервер прислал свежий список (переход по странице, revalidatePath) — берём его
	if (initial !== previousInitial) {
		setPreviousInitial(initial)
		setNotifications(initial)
	}

	const refresh = async () => {
		if (document.visibilityState !== 'visible') return
		try {
			const response = await fetch('/api/notifications', { cache: 'no-store' })
			if (response.ok) setNotifications(await response.json())
		} catch {
			// Сеть недоступна — попробуем в следующий раз
		}
	}
	const onVisible = useEffectEvent(() => void refresh())

	useRealtimeEvent('notification', () => void refresh())

	useEffect(() => {
		const handler = () => onVisible()
		document.addEventListener('visibilitychange', handler)
		if (connected) handler()
		const timer = connected ? undefined : setInterval(handler, POLL_INTERVAL_MS)
		return () => {
			clearInterval(timer)
			document.removeEventListener('visibilitychange', handler)
		}
	}, [connected])

	const remove = (id: number) => setNotifications(list => list.filter(item => item.id !== id))

	return { notifications, remove }
}
