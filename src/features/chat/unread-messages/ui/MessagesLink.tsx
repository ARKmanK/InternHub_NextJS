'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { MessageSquare } from 'lucide-react'
import { routes } from '@/shared/config'
import { useRealtimeEvent } from '@/shared/lib/realtime'
import { Button } from '@/shared/ui/button'

type MessagesLinkProps = {
	currentUserId: string
	/** Непрочитанные на момент рендера на сервере */
	unreadCount: number
}

/** Кнопка «Сообщения» в шапке со счётчиком непрочитанных; новое сообщение увеличивает его сразу. */
export function MessagesLink({ currentUserId, unreadCount }: MessagesLinkProps) {
	const t = useTranslations('UnreadMessages')
	const [count, setCount] = useState(unreadCount)
	const [previous, setPrevious] = useState(unreadCount)
	const pathname = usePathname() ?? '/'

	// Сервер пересчитал (переход, чат прочитан) — его значение главнее
	if (unreadCount !== previous) {
		setPrevious(unreadCount)
		setCount(unreadCount)
	}

	useRealtimeEvent('message', event => {
		if (event.message.authorId === currentUserId) return
		// Открытый чат сам отметит сообщение прочитанным — его не считаем
		if (pathname === routes.conversation(event.conversationId)) return
		setCount(value => value + 1)
	})

	const label = count > 0 ? t('labelUnread', { count }) : t('label')

	return (
		<Button asChild variant='outline' size='icon' className='relative'>
			<Link href={routes.messages()} aria-label={label} title={label}>
				<MessageSquare />
				{count > 0 && (
					<span className='absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-xs text-primary-foreground'>
						{count > 99 ? '99+' : count}
					</span>
				)}
			</Link>
		</Button>
	)
}
