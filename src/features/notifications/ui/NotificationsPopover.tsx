'use client'

import { useOptimistic, useTransition } from 'react'
import Link from 'next/link'
import { useFormatter, useTranslations } from 'next-intl'
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
import type { INotification } from '@/entities/notification'
import { markNotificationReadAction } from '../api/markNotificationReadAction'

/** Данные приходят с сервера пропсом — без фейковой загрузки при открытии. */
export function NotificationsPopover({ notifications }: { notifications: INotification[] }) {
	const t = useTranslations('Notifications')
	const tCommon = useTranslations('Common')
	const format = useFormatter()
	const [isPending, startTransition] = useTransition()
	const [visible, removeOptimistic] = useOptimistic(notifications, (list, id: number) =>
		list.filter(item => item.id !== id),
	)

	const markRead = (id: number) =>
		startTransition(async () => {
			removeOptimistic(id)
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
								<Item key={notification.id} variant='outline' size='sm'>
									<ItemContent>
										<ItemTitle>
											{notification.link ? (
												<Link href={notification.link}>{notification.title}</Link>
											) : (
												notification.title
											)}
										</ItemTitle>
										<ItemDescription>{notification.description}</ItemDescription>
										<span className='text-xs text-muted-foreground'>
											{format.relativeTime(new Date(notification.createdAt))}
										</span>
									</ItemContent>
									<ItemActions>
										<Button
											variant='ghost'
											size='icon-sm'
											disabled={isPending}
											aria-label={t('markRead')}
											onClick={() => markRead(notification.id)}
										>
											<Check />
										</Button>
									</ItemActions>
								</Item>
							))}
						</ItemGroup>
					</ScrollArea>
				)}
			</PopoverContent>
		</Popover>
	)
}
