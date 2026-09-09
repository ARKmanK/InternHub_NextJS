'use client'

import {
	Popover,
	PopoverContent,
	PopoverDescription,
	PopoverHeader,
	PopoverTitle,
	PopoverTrigger,
} from '@/components/ui/popover'
import { useEffect, useState } from 'react'
import { INotification } from '../model/INotification'
import { Button } from '@/components/ui/button'
import { BellIcon } from 'lucide-react'
import NotificationSkeleton from '@/entities/notification/ui/NotificationSkeleton'
import {
	Item,
	ItemActions,
	ItemContent,
	ItemDescription,
	ItemHeader,
	ItemMedia,
} from '@/components/ui/item'
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { toast } from 'sonner'

type NotificationClientProps = {
	initialData: INotification[]
	error: any
}

export default function NotificationClient({ initialData, error }: NotificationClientProps) {
	const [isOpen, setIsOpen] = useState(false)
	const [isLoading, setIsLoading] = useState(false)

	const handleOpenChange = (open: boolean) => {
		setIsOpen(open)

		if (open) {
			setIsLoading(true)
			setTimeout(() => {
				setIsLoading(false)
			}, 1000)
		}
	}

	if (error) {
		toast.error('Notification error')
	}

	return (
		<Popover open={isOpen} onOpenChange={handleOpenChange}>
			<PopoverTrigger asChild>
				<Button variant='outline' className='relative'>
					<BellIcon />
					{initialData.length > 0 && (
						<span className='absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center'>
							{initialData.length}
						</span>
					)}
				</Button>
			</PopoverTrigger>
			<PopoverContent className='w-80'>
				<div className='mt-2 max-h-60 overflow-y-auto'>
					{isLoading ? (
						<NotificationSkeleton />
					) : initialData.length === 0 ? (
						<p className='text-muted-foreground text-sm p-4 text-center'>Нет новых уведомлений</p>
					) : (
						initialData.map(notification => (
							<Item variant={'outline'}>
								<ItemMedia>
									<Avatar className='size-10'>
										<AvatarImage src={notification.image} />
									</Avatar>
								</ItemMedia>
								<ItemContent>
									<ItemHeader>{notification.from}</ItemHeader>
									<ItemDescription>{notification.description}</ItemDescription>
								</ItemContent>
								<ItemActions>
									<span>{notification.createdAt}</span>
								</ItemActions>
							</Item>
						))
					)}
				</div>
			</PopoverContent>
		</Popover>
	)
}
