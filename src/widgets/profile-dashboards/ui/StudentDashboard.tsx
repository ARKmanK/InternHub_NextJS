import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { Award } from 'lucide-react'
import { routes } from '@/shared/config'
import { Button } from '@/shared/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs'
import { getStudentPractices } from '@/entities/practice/index.server'
import { TaskCard } from '@/entities/task'
import {
	getFavoriteTasks,
	getStudentAcceptedTasks,
	getStudentTasksInProgress,
} from '@/entities/task/index.server'
import type { IUser } from '@/entities/user'
import { FavoriteButton } from '@/features/task/toggle-favorite'
import { EmptyList } from './EmptyList'
import { StudentPractices } from './StudentPractices'

export async function StudentDashboard({ user }: { user: IUser }) {
	const t = await getTranslations('ProfileDashboards')
	const [favorite, started, approved, practices] = await Promise.all([
		getFavoriteTasks(user.id),
		getStudentTasksInProgress(user.id),
		getStudentAcceptedTasks(user.id),
		getStudentPractices(user.id),
	])

	const tabs = [
		{ value: 'favorite', label: t('favorite'), tasks: favorite },
		{ value: 'started', label: t('started'), tasks: started },
		{ value: 'approved', label: t('approved'), tasks: approved },
	]

	return (
		<section className='flex flex-col gap-4'>
			<div className='flex flex-wrap items-center justify-between gap-4'>
				<h1 className='text-2xl font-semibold'>{t('studentTitle')}</h1>
				<Button asChild variant='outline'>
					<Link href={routes.studentPortfolio(user.id)}>
						<Award /> {t('myPortfolio')}
					</Link>
				</Button>
			</div>
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
			{practices.length > 0 && <StudentPractices practices={practices} />}
		</section>
	)
}
