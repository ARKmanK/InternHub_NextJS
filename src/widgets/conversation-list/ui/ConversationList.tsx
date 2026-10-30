import { getTranslations } from 'next-intl/server'
import { routes } from '@/shared/config'
import { ConversationListItem } from '@/entities/conversation'
import { getConversations } from '@/entities/conversation/index.server'
import { StartChatByEmailForm } from '@/features/chat/start-conversation'
import { RefreshOnMessage } from './RefreshOnMessage'

type ConversationListProps = {
	currentUserId: string
	activeId?: number
}

/** Список чатов: рендерится на сервере, при новом сообщении перерисовывается (порядок, превью, счётчики). */
export async function ConversationList({ currentUserId, activeId }: ConversationListProps) {
	const t = await getTranslations('ConversationList')
	const conversations = await getConversations(currentUserId)

	return (
		<nav aria-label={t('title')} className='flex min-h-0 flex-col gap-3'>
			<RefreshOnMessage />
			<h1 className='text-2xl font-semibold'>{t('title')}</h1>
			<StartChatByEmailForm />
			{conversations.length === 0 ? (
				<p className='text-sm text-muted-foreground'>{t('empty')}</p>
			) : (
				<ul className='flex flex-col gap-1 overflow-y-auto'>
					{conversations.map(conversation => (
						<li key={conversation.id}>
							<ConversationListItem
								conversation={conversation}
								href={routes.conversation(conversation.id)}
								currentUserId={currentUserId}
								isActive={conversation.id === activeId}
							/>
						</li>
					))}
				</ul>
			)}
		</nav>
	)
}
