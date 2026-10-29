import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { Award } from 'lucide-react'
import { routes } from '@/shared/config'
import { Button } from '@/shared/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs'
import { CompetencyProfile } from '@/entities/competency'
import {
	getCompetencies,
	getStudentCompetencies,
	getStudentInterestIds,
} from '@/entities/competency/index.server'
import { getStudentPractices } from '@/entities/practice/index.server'
import { TaskCard, type ITask } from '@/entities/task'
import {
	getFavoriteTasks,
	getRecommendedTasks,
	getStudentAcceptedTasks,
	getStudentTasksInProgress,
} from '@/entities/task/index.server'
import type { IUser } from '@/entities/user'
import { InterestsPicker } from '@/features/student/edit-interests'
import { FavoriteButton } from '@/features/task/toggle-favorite'
import { EmptyList } from './EmptyList'
import { RecommendationReasons } from './RecommendationReasons'
import { StudentPractices } from './StudentPractices'

const StudentTaskCard = ({ task }: { task: ITask }) => (
	<TaskCard
		task={task}
		actions={<FavoriteButton taskId={task.id} isFavorite={task.isFavorite} />}
	/>
)

export async function StudentDashboard({ user }: { user: IUser }) {
	const t = await getTranslations('ProfileDashboards')
	const [recommended, favorite, started, approved, practices, competencies, catalog, interests] =
		await Promise.all([
			getRecommendedTasks(user.id),
			getFavoriteTasks(user.id),
			getStudentTasksInProgress(user.id),
			getStudentAcceptedTasks(user.id),
			getStudentPractices(user.id),
			getStudentCompetencies(user.id),
			getCompetencies(),
			getStudentInterestIds(user.id),
		])

	const tabs = [
		{ value: 'favorite', label: t('favorite'), tasks: favorite },
		{ value: 'started', label: t('started'), tasks: started },
		{ value: 'approved', label: t('approved'), tasks: approved },
	]

	return (
		<section className='flex flex-col gap-8'>
			<div className='flex flex-wrap items-center justify-between gap-4'>
				<h1 className='text-2xl font-semibold'>{t('studentTitle')}</h1>
				<Button asChild variant='outline'>
					<Link href={routes.studentPortfolio(user.id)}>
						<Award /> {t('myPortfolio')}
					</Link>
				</Button>
			</div>
			<Tabs defaultValue='recommended'>
				<TabsList>
					<TabsTrigger value='recommended'>{t('recommended')}</TabsTrigger>
					{tabs.map(tab => (
						<TabsTrigger key={tab.value} value={tab.value}>
							{tab.label}
						</TabsTrigger>
					))}
				</TabsList>
				<TabsContent value='recommended' className='flex flex-col gap-4'>
					{recommended.length === 0 ? (
						<EmptyList title={t('noRecommendations')} />
					) : (
						recommended.map(({ task, reasons }) => (
							<div key={task.id} className='flex flex-col gap-2'>
								<StudentTaskCard task={task} />
								<RecommendationReasons reasons={reasons} />
							</div>
						))
					)}
				</TabsContent>
				{tabs.map(tab => (
					<TabsContent key={tab.value} value={tab.value} className='flex flex-col gap-4'>
						{tab.tasks.length === 0 ? (
							<EmptyList title={t('empty')} />
						) : (
							tab.tasks.map(task => <StudentTaskCard key={task.id} task={task} />)
						)}
					</TabsContent>
				))}
			</Tabs>

			<section className='flex flex-col gap-4'>
				<h2 className='text-lg font-medium'>{t('myCompetencies')}</h2>
				<CompetencyProfile items={competencies} />
				<h3 className='font-medium'>{t('interests')}</h3>
				<InterestsPicker options={catalog} selected={interests} />
			</section>

			{practices.length > 0 && <StudentPractices practices={practices} />}
		</section>
	)
}
