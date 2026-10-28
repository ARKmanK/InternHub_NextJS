import { getTranslations } from 'next-intl/server'
import { OrganizationCard } from '@/entities/organization'
import { getOrganizationsForReview } from '@/entities/organization/index.server'
import { TaskCard } from '@/entities/task'
import { getTasksOnModeration } from '@/entities/task/index.server'
import { VerifyOrganizationActions } from '@/features/organization/verify-organization'
import { ModerationActions } from '@/features/task/task-moderation'
import { EmptyList } from './EmptyList'

export async function AdminDashboard() {
	const t = await getTranslations('ProfileDashboards')
	const [organizations, tasks] = await Promise.all([
		getOrganizationsForReview(),
		getTasksOnModeration(),
	])

	return (
		<section className='flex flex-col gap-8'>
			<h1 className='text-2xl font-semibold'>{t('adminTitle')}</h1>

			<section className='flex flex-col gap-4'>
				<h2 className='text-lg font-medium'>
					{t('organizationsReview')} ({organizations.length})
				</h2>
				{organizations.length === 0 ? (
					<EmptyList title={t('empty')} />
				) : (
					organizations.map(organization => (
						<OrganizationCard
							key={organization.id}
							organization={organization}
							actions={<VerifyOrganizationActions organizationId={organization.id} />}
						/>
					))
				)}
			</section>

			<section className='flex flex-col gap-4'>
				<h2 className='text-lg font-medium'>
					{t('moderation')} ({tasks.length})
				</h2>
				{tasks.length === 0 ? (
					<EmptyList title={t('empty')} />
				) : (
					tasks.map(task => (
						<TaskCard key={task.id} task={task} actions={<ModerationActions taskId={task.id} />} />
					))
				)}
			</section>
		</section>
	)
}
