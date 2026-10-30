'use client'

import { useRouter } from 'next/navigation'
import { useRealtimeEvent } from '@/shared/lib/realtime'

/**
 * Новое сообщение в любом чате — перезапросить серверные компоненты страницы.
 * Так список остаётся серверным (без копии логики на клиенте), а порядок и счётчики — свежими.
 */
export function RefreshOnMessage() {
	const router = useRouter()
	useRealtimeEvent('message', () => router.refresh())
	return null
}
