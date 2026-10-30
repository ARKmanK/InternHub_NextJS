import Link from 'next/link'
import { useFormatter, useTranslations } from 'next-intl'
import { cn } from 'cn'
import { Badge } from '@/shared/ui/badge'
import type { IConversationPreview } from '../model/IConversation'
import { PeerAvatar } from './PeerAvatar'

type ConversationListItemProps = {
	conversation: IConversationPreview
	href: string
	currentUserId: string
	isActive: boolean
}

export function ConversationListItem({
	conversation,
	href,
	currentUserId,
	isActive,
}: ConversationListItemProps) {
	const t = useTranslations('Conversation')
	const format = useFormatter()
	const { peer, lastMessage, unreadCount } = conversation

	return (
		<Link
			href={href}
			aria-current={isActive ? 'page' : undefined}
			className={cn(
				'flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-muted',
				isActive && 'bg-muted',
			)}
		>
			<PeerAvatar name={peer.name} />
			<div className='min-w-0 flex-1'>
				<div className='flex items-baseline justify-between gap-2'>
					<span className='truncate font-medium'>{peer.name}</span>
					{lastMessage && (
						<time
							dateTime={lastMessage.createdAt}
							className='shrink-0 text-xs text-muted-foreground'
						>
							{format.relativeTime(new Date(lastMessage.createdAt))}
						</time>
					)}
				</div>
				<div className='flex items-center justify-between gap-2'>
					<span className='truncate text-sm text-muted-foreground'>
						{lastMessage
							? `${lastMessage.authorId === currentUserId ? `${t('you')}: ` : ''}${lastMessage.text}`
							: t('noMessages')}
					</span>
					{unreadCount > 0 && (
						<Badge className='shrink-0' aria-label={t('unread', { count: unreadCount })}>
							{unreadCount}
						</Badge>
					)}
				</div>
			</div>
		</Link>
	)
}
