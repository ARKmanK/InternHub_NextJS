'use client'

import { useTransition } from 'react'
import Link from 'next/link'
import { useFormatter, useNow, useTranslations } from 'next-intl'
import { BellIcon, Check } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/shared/ui/button'
import {
	Item,
	ItemActions,
	ItemContent,
	ItemDescription,
	ItemGroup,
	ItemTitle,
} from '@/shared/ui/item'
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/popover'
import { ScrollArea } from '@/shared/ui/scroll-area'
import { useNotificationText, type INotification } from '@/entities/notification'
import { markNotificationReadAction } from '../api/markNotificationReadAction'
import { useLiveNotifications } from '../model/useLiveNotifications'

export function NotificationsPopover({ notifications }: { notifications: INotification[] }) {
	const t = useTranslations('Notifications')
	const tCommon = useTranslations('Common')
	const [isPending, startTransition] = useTransition()
	const { notifications: visible, remove } = useLiveNotifications(notifications)

	const markRead = (id: number) =>
		startTransition(async () => {
			remove(id)
			const result = await markNotificationReadAction(id)
			if (!result.ok) toast.error(tCommon(result.error))
		})

	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button variant='outline' size='icon' className='relative' aria-label={t('label')}>
					<BellIcon />
					{visible.length > 0 && (
						<span className='absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full bg-destructive text-[10px] text-white'>
							{visible.length}
						</span>
					)}
				</Button>
			</PopoverTrigger>
			<PopoverContent className='w-80 p-0' align='end'>
				{visible.length === 0 ? (
					<p className='p-4 text-center text-sm text-muted-foreground'>{t('empty')}</p>
				) : (
					<ScrollArea className='max-h-80'>
						<ItemGroup className='p-2'>
							{visible.map(notification => (
								<NotificationItem
									key={notification.id}
									notification={notification}
									disabled={isPending}
									markReadLabel={t('markRead')}
									onMarkRead={() => markRead(notification.id)}
								/>
							))}
						</ItemGroup>
					</ScrollArea>
				)}
			</PopoverContent>
		</Popover>
	)
}

type NotificationItemProps = {
	notification: INotification
	disabled: boolean
	markReadLabel: string
	onMarkRead: () => void
}

function NotificationItem({
	notification,
	disabled,
	markReadLabel,
	onMarkRead,
}: NotificationItemProps) {
	const format = useFormatter()
	// Начинает с серверного «сейчас» (совпадает при гидратации) и обновляется раз в минуту
	const now = useNow({ updateInterval: 60_000 })
	const { title, body, comment } = useNotificationText(notification)

	return (
		<Item variant='outline' size='sm'>
			<ItemContent>
				<ItemTitle>
					{notification.link ? <Link href={notification.link}>{title}</Link> : title}
				</ItemTitle>
				<ItemDescription>{body}</ItemDescription>
				{comment && (
					<p className='line-clamp-3 border-l-2 pl-2 text-sm whitespace-pre-line'>{comment}</p>
				)}
				<span className='text-xs text-muted-foreground'>
					{format.relativeTime(new Date(notification.createdAt), now)}
				</span>
			</ItemContent>
			<ItemActions>
				<Button
					variant='ghost'
					size='icon-sm'
					disabled={disabled}
					aria-label={markReadLabel}
					onClick={onMarkRead}
				>
					<Check />
				</Button>
			</ItemActions>
		</Item>
	)
}
