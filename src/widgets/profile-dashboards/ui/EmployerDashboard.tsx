import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { Pencil, Plus, ShieldAlert } from 'lucide-react'
import { routes } from '@/shared/config'
import { Alert, AlertDescription, AlertTitle } from '@/shared/ui/alert'
import { Button } from '@/shared/ui/button'
import { TaskCard } from '@/entities/task'
import { getTasksByAuthor } from '@/entities/task/index.server'
import type { IUser } from '@/entities/user'
import { TaskDeleteDialog } from '@/features/task/task-delete'
import { EmptyList } from './EmptyList'

export async function EmployerDashboard({ user }: { user: IUser }) {
	const t = await getTranslations('ProfileDashboards')
	const tasks = await getTasksByAuthor(user.id)
	const organizationStatus = user.organization?.status
	const canPublish = organizationStatus === 'verified'

	return (
		<section className='flex flex-col gap-4'>
			<div className='flex items-center justify-between gap-4'>
				<div className='flex flex-col gap-1'>
					<h1 className='text-2xl font-semibold'>{t('employerTitle')}</h1>
					{user.organization && <p className='text-muted-foreground'>{user.organization.name}</p>}
				</div>
				{canPublish && (
					<Button asChild>
						<Link href={routes.taskCreate()}>
							<Plus /> {t('createTask')}
						</Link>
					</Button>
				)}
			</div>
			{!canPublish && (
				<Alert>
					<ShieldAlert />
					<AlertTitle>
						{organizationStatus === 'pending' ? t('orgPendingTitle') : t('orgRejectedTitle')}
					</AlertTitle>
					<AlertDescription>
						{organizationStatus === 'pending'
							? t('orgPendingDescription')
							: t('orgRejectedDescription')}
					</AlertDescription>
				</Alert>
			)}
			{tasks.length === 0 ? (
				<EmptyList title={t('empty')} />
			) : (
				tasks.map(task => (
					<TaskCard
						key={task.id}
						task={task}
						showStatus
						actions={
							<>
								<Button asChild variant='ghost' size='icon' aria-label={t('edit')}>
									<Link href={routes.taskEdit(task.id)}>
										<Pencil />
									</Link>
								</Button>
								<TaskDeleteDialog taskId={task.id} taskTitle={task.title} />
							</>
						}
					/>
				))
			)}
		</section>
	)
}
