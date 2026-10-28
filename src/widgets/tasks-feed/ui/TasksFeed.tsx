'use client'

import { useState, useTransition } from 'react'
import { useTranslations } from 'next-intl'
import { SearchX } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/shared/ui/button'
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/shared/ui/empty'
import { Spinner } from '@/shared/ui/spinner'
import { TaskCard, TaskListSkeleton, type TaskFilters, type TasksPage } from '@/entities/task'
import type { UserRole } from '@/entities/user'
import { FavoriteButton } from '@/features/task/toggle-favorite'
import { loadMoreTasks } from '../api/loadMoreTasks'

type TasksFeedProps = {
	initialPage: TasksPage
	filters: TaskFilters
	viewer: { id: string; role: UserRole } | null
}

export function TasksFeed({ initialPage, filters, viewer }: TasksFeedProps) {
	const t = useTranslations('TasksFeed')
	const tCommon = useTranslations('Common')
	const [tasks, setTasks] = useState(initialPage.items)
	const [hasMore, setHasMore] = useState(initialPage.hasMore)
	const [isPending, startTransition] = useTransition()

	const handleLoadMore = () =>
		startTransition(async () => {
			try {
				const page = await loadMoreTasks(filters, tasks.length)
				setTasks(prev => [...prev, ...page.items])
				setHasMore(page.hasMore)
			} catch {
				toast.error(tCommon('unknownError'))
			}
		})

	if (tasks.length === 0) {
		return (
			<Empty className='border border-dashed'>
				<EmptyHeader>
					<EmptyMedia variant='icon'>
						<SearchX />
					</EmptyMedia>
					<EmptyTitle>{t('emptyTitle')}</EmptyTitle>
					<EmptyDescription>{t('emptyDescription')}</EmptyDescription>
				</EmptyHeader>
			</Empty>
		)
	}

	return (
		<div className='flex flex-col gap-4'>
			{tasks.map(task => (
				<TaskCard
					key={task.id}
					task={task}
					isMine={viewer?.role === 'employer' && viewer.id === task.authorId}
					actions={
						viewer?.role === 'student' && (
							<FavoriteButton taskId={task.id} isFavorite={task.isFavorite} />
						)
					}
				/>
			))}
			{isPending && <TaskListSkeleton count={2} />}
			{hasMore && (
				<Button variant='outline' disabled={isPending} onClick={handleLoadMore}>
					{isPending ? <Spinner /> : tCommon('loadMore')}
				</Button>
			)}
		</div>
	)
}
