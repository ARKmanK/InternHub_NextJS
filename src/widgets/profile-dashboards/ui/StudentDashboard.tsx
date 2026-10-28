import { getTranslations } from 'next-intl/server'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs'
import { TaskCard, type ITask } from '@/entities/task'
import { getFavoriteTasks } from '@/entities/task/index.server'
import type { IUser } from '@/entities/user'
import { FavoriteButton } from '@/features/task/toggle-favorite'
import { EmptyList } from './EmptyList'

export async function StudentDashboard({ user }: { user: IUser }) {
	const t = await getTranslations('ProfileDashboards')
	const favorite = await getFavoriteTasks(user.id)
	// TODO(этап 3): задачи «в работе» и «принятые» берутся из решений студента
	const started: ITask[] = []
	const approved: ITask[] = []

	const tabs = [
		{ value: 'favorite', label: t('favorite'), tasks: favorite },
		{ value: 'started', label: t('started'), tasks: started },
		{ value: 'approved', label: t('approved'), tasks: approved },
	]

	return (
		<section className='flex flex-col gap-4'>
			<h1 className='text-2xl font-semibold'>{t('studentTitle')}</h1>
			<Tabs defaultValue='favorite'>
				<TabsList>
					{tabs.map(tab => (
						<TabsTrigger key={tab.value} value={tab.value}>
							{tab.label}
						</TabsTrigger>
					))}
				</TabsList>
				{tabs.map(tab => (
					<TabsContent key={tab.value} value={tab.value} className='flex flex-col gap-4'>
						{tab.tasks.length === 0 ? (
							<EmptyList title={t('empty')} />
						) : (
							tab.tasks.map(task => (
								<TaskCard
									key={task.id}
									task={task}
									actions={<FavoriteButton taskId={task.id} isFavorite={task.isFavorite} />}
								/>
							))
						)}
					</TabsContent>
				))}
			</Tabs>
		</section>
	)
}
