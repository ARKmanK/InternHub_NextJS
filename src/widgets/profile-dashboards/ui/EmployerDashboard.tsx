import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { Pencil, Plus } from 'lucide-react'
import { routes } from '@/shared/config'
import { Button } from '@/shared/ui/button'
import { TaskCard } from '@/entities/task'
import { getTasksByAuthor } from '@/entities/task/index.server'
import type { IUser } from '@/entities/user'
import { TaskDeleteDialog } from '@/features/task/task-delete'
import { EmptyList } from './EmptyList'

export async function EmployerDashboard({ user }: { user: IUser }) {
	const t = await getTranslations('ProfileDashboards')
	const tasks = await getTasksByAuthor(user.id)

	return (
		<section className='flex flex-col gap-4'>
			<div className='flex items-center justify-between gap-4'>
				<h1 className='text-2xl font-semibold'>{t('employerTitle')}</h1>
				<Button asChild>
					<Link href={routes.taskCreate()}>
						<Plus /> {t('createTask')}
					</Link>
				</Button>
			</div>
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
