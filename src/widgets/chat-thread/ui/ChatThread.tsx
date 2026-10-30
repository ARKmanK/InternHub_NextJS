'use client'

import { useEffect, useEffectEvent, useLayoutEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { ArrowLeft } from 'lucide-react'
import { routes } from '@/shared/config'
import { useRealtimeConnected, useRealtimeEvent } from '@/shared/lib/realtime'
import { Button } from '@/shared/ui/button'
import { MessageBubble, PeerAvatar, type IChatPeer, type IMessage } from '@/entities/conversation'
import { markConversationReadAction } from '@/features/chat/read-conversation'
import { MessageComposer } from '@/features/chat/send-message'

type ChatThreadProps = {
	conversationId: number
	currentUserId: string
	peer: IChatPeer
	initialMessages: IMessage[]
	initialHasMore: boolean
}

type MessagesPage = { messages: IMessage[]; hasMore: boolean }

// Сообщение могло прийти дважды: ответом server action и событием по WebSocket
const merge = (current: IMessage[], incoming: IMessage[]) => {
	const byId = new Map(current.map(message => [message.id, message]))
	for (const message of incoming) byId.set(message.id, message)
	return [...byId.values()].sort((a, b) => a.id - b.id)
}

const fetchPage = async (conversationId: number, before?: number): Promise<MessagesPage | null> => {
	const query = before ? `?before=${before}` : ''
	const response = await fetch(`/api/conversations/${conversationId}/messages${query}`, {
		cache: 'no-store',
	})
	return response.ok ? response.json() : null
}

/** Окно переписки: история, новые сообщения в реальном времени, поле ввода. */
export function ChatThread({
	conversationId,
	currentUserId,
	peer,
	initialMessages,
	initialHasMore,
}: ChatThreadProps) {
	const t = useTranslations('ChatThread')
	const tRole = useTranslations('Conversation')
	const tCommon = useTranslations('Common')
	const connected = useRealtimeConnected()
	const [messages, setMessages] = useState(initialMessages)
	const [hasMore, setHasMore] = useState(initialHasMore)
	const [loadingOlder, setLoadingOlder] = useState(false)

	const scrollRef = useRef<HTMLDivElement>(null)
	const stickToBottom = useRef(true)
	// Высота до подгрузки старых сообщений — чтобы экран не прыгнул
	const heightBeforeOlder = useRef<number | null>(null)
	const readTimer = useRef<ReturnType<typeof setTimeout>>(undefined)

	const markRead = () => {
		clearTimeout(readTimer.current)
		// Небольшая пауза: пачка сообщений подряд — один запрос
		readTimer.current = setTimeout(() => void markConversationReadAction(conversationId), 500)
	}
	const markReadOnOpen = useEffectEvent(markRead)

	useEffect(() => {
		markReadOnOpen()
		return () => clearTimeout(readTimer.current)
	}, [])

	useRealtimeEvent('message', event => {
		if (event.conversationId !== conversationId) return
		setMessages(current => merge(current, [{ ...event.message, conversationId }]))
		if (event.message.authorId !== currentUserId && document.visibilityState === 'visible')
			markRead()
	})

	// После переподключения догружаем то, что могло прийти за время разрыва
	const resync = useEffectEvent(async () => {
		const page = await fetchPage(conversationId)
		if (page) setMessages(current => merge(current, page.messages))
	})
	useEffect(() => {
		if (connected) void resync()
	}, [connected])

	useLayoutEffect(() => {
		const element = scrollRef.current
		if (!element) return
		if (heightBeforeOlder.current !== null) {
			element.scrollTop += element.scrollHeight - heightBeforeOlder.current
			heightBeforeOlder.current = null
		} else if (stickToBottom.current) {
			element.scrollTop = element.scrollHeight
		}
	}, [messages])

	const onScroll = () => {
		const element = scrollRef.current
		if (!element) return
		stickToBottom.current = element.scrollHeight - element.scrollTop - element.clientHeight < 80
	}

	const loadOlder = async () => {
		const first = messages[0]
		if (!first) return
		setLoadingOlder(true)
		const page = await fetchPage(conversationId, first.id)
		setLoadingOlder(false)
		if (!page) return
		heightBeforeOlder.current = scrollRef.current?.scrollHeight ?? null
		setHasMore(page.hasMore)
		setMessages(current => merge(current, page.messages))
	}

	const onSent = (message: IMessage) => {
		stickToBottom.current = true
		setMessages(current => merge(current, [message]))
	}

	return (
		<section
			className='flex h-full min-h-0 flex-col gap-3'
			aria-label={t('label', { name: peer.name })}
		>
			<header className='flex items-center gap-3 border-b pb-3'>
				<Button
					asChild
					variant='ghost'
					size='icon'
					className='md:hidden'
					aria-label={tCommon('back')}
				>
					<Link href={routes.messages()}>
						<ArrowLeft />
					</Link>
				</Button>
				<PeerAvatar name={peer.name} />
				<div className='min-w-0'>
					<h2 className='truncate font-semibold'>{peer.name}</h2>
					<p className='truncate text-sm text-muted-foreground'>
						{tRole(peer.role)}
						{peer.subtitle && ` · ${peer.subtitle}`}
					</p>
				</div>
			</header>

			<div
				ref={scrollRef}
				onScroll={onScroll}
				className='flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto pr-1'
				// role="log" — история чата: скринридер зачитывает новые сообщения
				role='log'
			>
				{hasMore && (
					<Button
						variant='ghost'
						size='sm'
						className='self-center'
						disabled={loadingOlder}
						onClick={loadOlder}
					>
						{t('older')}
					</Button>
				)}
				{messages.length === 0 ? (
					<p className='m-auto text-sm text-muted-foreground'>{t('empty', { name: peer.name })}</p>
				) : (
					messages.map(message => (
						<MessageBubble
							key={message.id}
							message={message}
							isOwn={message.authorId === currentUserId}
						/>
					))
				)}
			</div>

			<MessageComposer conversationId={conversationId} onSent={onSent} />
		</section>
	)
}
