import type { ReactNode } from 'react'
import Link from 'next/link'
import { useFormatter, useTranslations } from 'next-intl'
import { BadgeCheck, Eye, Star } from 'lucide-react'
import { routes } from '@/shared/config'
import { Badge } from '@/shared/ui/badge'
import { Button } from '@/shared/ui/button'
import {
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/shared/ui/card'
import { Tag } from '@/entities/tag/@x/task'
import type { ITask } from '../model/ITask'

type TaskCardProps = {
	task: ITask
	/** Задача принадлежит текущему работодателю — решает вызывающий код, а не карточка. */
	isMine?: boolean
	/** Слот для кнопок из фич: избранное, редактирование, удаление, модерация. */
	actions?: ReactNode
	showStatus?: boolean
}

const statusKey = {
	draft: 'statusDraft',
	moderation: 'statusModeration',
	published: 'statusPublished',
	closed: 'statusClosed',
	archived: 'statusArchived',
} as const

export function TaskCard({ task, isMine = false, actions, showStatus = false }: TaskCardProps) {
	const t = useTranslations('TaskCard')
	const format = useFormatter()

	return (
		<Card>
			<CardHeader>
				<CardTitle>{task.title}</CardTitle>
				<CardDescription className='flex flex-wrap items-center gap-2'>
					<span>{task.companyName}</span>
					{isMine && (
						<Badge variant='outline'>
							<BadgeCheck /> {t('isMine')}
						</Badge>
					)}
					{showStatus && <Badge variant='secondary'>{t(statusKey[task.status])}</Badge>}
				</CardDescription>
				{actions && <CardAction className='flex gap-1'>{actions}</CardAction>}
			</CardHeader>
			<CardContent className='flex flex-col gap-3'>
				<p className='line-clamp-3 text-sm text-muted-foreground'>{task.description}</p>
				{task.tags.length > 0 && (
					<div className='flex flex-wrap gap-1'>
						{task.tags.map(tag => (
							<Tag key={tag} label={tag} />
						))}
					</div>
				)}
				<dl className='grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-sm'>
					<dt className='text-muted-foreground'>{t('deadline')}</dt>
					<dd>
						{task.deadline
							? format.dateTime(new Date(task.deadline), { dateStyle: 'long' })
							: t('unlimited')}
					</dd>
					<dt className='text-muted-foreground'>{t('difficulty')}</dt>
					<dd className='flex' aria-label={`${task.difficulty} / 3`}>
						{[1, 2, 3].map(level => (
							<Star
								key={level}
								className='size-4'
								fill={level <= task.difficulty ? 'currentColor' : 'none'}
							/>
						))}
					</dd>
				</dl>
			</CardContent>
			<CardFooter className='justify-between'>
				<span className='flex items-center gap-1 text-sm text-muted-foreground'>
					<Eye className='size-4' /> {t('tracking')}: {task.trackingCount}
				</span>
				<Button asChild variant='link'>
					<Link href={routes.task(task.id)}>{t('taskPage')}</Link>
				</Button>
			</CardFooter>
		</Card>
	)
}
