import { getTranslations } from 'next-intl/server'
import { TaskCard } from '@/entities/task'
import { getTasksOnModeration } from '@/entities/task/index.server'
import { ModerationActions } from '@/features/task/task-moderation'
import { EmptyList } from './EmptyList'

export async function AdminDashboard() {
	const t = await getTranslations('ProfileDashboards')
	const tasks = await getTasksOnModeration()

	return (
		<section className='flex flex-col gap-4'>
			<h1 className='text-2xl font-semibold'>{t('adminTitle')}</h1>
			<h2 className='text-lg text-muted-foreground'>{t('moderation')}</h2>
			{tasks.length === 0 ? (
				<EmptyList title={t('empty')} />
			) : (
				tasks.map(task => (
					<TaskCard key={task.id} task={task} actions={<ModerationActions taskId={task.id} />} />
				))
			)}
		</section>
	)
}
