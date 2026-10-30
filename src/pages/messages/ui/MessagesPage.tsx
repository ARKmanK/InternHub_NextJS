import { notFound, redirect } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { MessagesSquare } from 'lucide-react'
import { cn } from 'cn'
import { routes } from '@/shared/config'
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle } from '@/shared/ui/empty'
import { getConversation, getMessages } from '@/entities/conversation/index.server'
import { getCurrentUser } from '@/entities/user/index.server'
import { ChatThread } from '@/widgets/chat-thread'
import { ConversationList } from '@/widgets/conversation-list'

/**
 * Сообщения: список чатов слева, открытый чат справа. На телефоне — что-то одно:
 * без выбранного чата список, с выбранным — переписка с кнопкой «назад».
 */
export async function MessagesPage({ conversationId }: { conversationId?: number }) {
	const user = await getCurrentUser()
	if (!user) redirect(routes.profile())

	const t = await getTranslations('MessagesPage')
	const [conversation, page] = conversationId
		? await Promise.all([
				getConversation(conversationId, user.id),
				getMessages(conversationId, user.id),
			])
		: [null, null]
	// Чужой чат выглядит так же, как несуществующий
	if (conversationId && (!conversation || !page)) notFound()

	return (
		<div className='grid h-[calc(100dvh-12rem)] min-h-[28rem] gap-6 md:grid-cols-[18rem_1fr]'>
			<aside className={cn('min-h-0', conversation ? 'hidden md:flex' : 'flex')}>
				<ConversationList currentUserId={user.id} activeId={conversationId} />
			</aside>
			<div className={cn('min-h-0', conversation ? 'flex flex-col' : 'hidden md:flex')}>
				{conversation && page ? (
					<ChatThread
						key={conversation.id}
						conversationId={conversation.id}
						currentUserId={user.id}
						peer={conversation.peer}
						initialMessages={page.messages}
						initialHasMore={page.hasMore}
					/>
				) : (
					<Empty className='border border-dashed'>
						<EmptyHeader>
							<EmptyMedia variant='icon'>
								<MessagesSquare />
							</EmptyMedia>
							<EmptyTitle>{t('choose')}</EmptyTitle>
						</EmptyHeader>
					</Empty>
				)}
			</div>
		</div>
	)
}
