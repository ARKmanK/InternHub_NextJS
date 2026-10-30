'use client'

import {
	createContext,
	use,
	useEffect,
	useEffectEvent,
	useRef,
	useState,
	type ReactNode,
} from 'react'
import type { RealtimeEvent, RealtimeEventType } from './events'

type Listener = (event: RealtimeEvent) => void

type RealtimeContextValue = {
	/** Соединение установлено. После переподключения события за время разрыва потеряны — перезапросите данные */
	connected: boolean
	subscribe: (listener: Listener) => () => void
}

const RealtimeContext = createContext<RealtimeContextValue>({
	connected: false,
	subscribe: () => () => {},
})

const MAX_RECONNECT_DELAY_MS = 30_000

/**
 * Одно WebSocket-соединение на вкладку. Токен берётся у приложения (/api/realtime/token),
 * при разрыве — переподключение с растущей паузой (1, 2, 4… до 30 с) и случайной добавкой,
 * чтобы после перезапуска сервера клиенты не ломились одновременно.
 *
 * Соединение только принимает события: отправка сообщений и любые изменения идут
 * через server actions, где проверяются права.
 */
export function RealtimeProvider({
	userId,
	children,
}: {
	userId: string | null
	children: ReactNode
}) {
	const listeners = useRef(new Set<Listener>())
	const [connected, setConnected] = useState(false)

	useEffect(() => {
		if (!userId) return

		let socket: WebSocket | null = null
		let timer: ReturnType<typeof setTimeout> | undefined
		let attempt = 0
		let stopped = false

		const scheduleReconnect = () => {
			if (stopped) return
			const delay = Math.min(MAX_RECONNECT_DELAY_MS, 1000 * 2 ** attempt) + Math.random() * 1000
			attempt += 1
			timer = setTimeout(connect, delay)
		}

		const connect = async () => {
			try {
				const response = await fetch('/api/realtime/token', { cache: 'no-store' })
				// 503 — realtime не настроен: работаем без него, не переподключаемся
				if (response.status === 503) return
				if (!response.ok) throw new Error(String(response.status))
				const { token, url } = (await response.json()) as { token: string; url: string }
				if (stopped) return

				socket = new WebSocket(`${url}?token=${encodeURIComponent(token)}`)
				socket.onopen = () => {
					attempt = 0
					setConnected(true)
				}
				socket.onmessage = message => {
					try {
						const event = JSON.parse(String(message.data)) as RealtimeEvent
						for (const listener of listeners.current) listener(event)
					} catch {
						// Непонятное сообщение — пропускаем
					}
				}
				socket.onclose = () => {
					setConnected(false)
					scheduleReconnect()
				}
			} catch {
				scheduleReconnect()
			}
		}

		void connect()
		return () => {
			stopped = true
			clearTimeout(timer)
			socket?.close()
			setConnected(false)
		}
	}, [userId])

	const subscribe = (listener: Listener) => {
		listeners.current.add(listener)
		return () => {
			listeners.current.delete(listener)
		}
	}

	return <RealtimeContext value={{ connected, subscribe }}>{children}</RealtimeContext>
}

/** Обработчик событий одного типа. Обработчик может меняться между рендерами — подписка не пересоздаётся. */
export function useRealtimeEvent<Type extends RealtimeEventType>(
	type: Type,
	handler: (event: Extract<RealtimeEvent, { type: Type }>) => void,
) {
	const { subscribe } = use(RealtimeContext)
	const onEvent = useEffectEvent((event: RealtimeEvent) => {
		if (event.type === type) handler(event as Extract<RealtimeEvent, { type: Type }>)
	})

	useEffect(() => subscribe(onEvent), [subscribe])
}

export const useRealtimeConnected = () => use(RealtimeContext).connected
