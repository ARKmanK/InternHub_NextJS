import { notFound } from 'next/navigation'
import { BackButton } from '@/shared/ui/back-button'
import { TaskCard } from '@/entities/task'
import { getTaskById } from '@/entities/task/index.server'
import { getCurrentUser } from '@/entities/user/index.server'
import { FavoriteButton } from '@/features/task/toggle-favorite'
import { TaskActivityTable } from '@/widgets/task-activity'

export async function TaskPage({ id }: { id: number }) {
	const [task, user] = await Promise.all([getTaskById(id), getCurrentUser()])
	if (!task) notFound()

	const isOwner = user?.role === 'employer' && user.id === task.employerId

	return (
		<div className='flex flex-col gap-6'>
			<div>
				<BackButton />
			</div>
			<TaskCard
				task={task}
				isMine={isOwner}
				showStatus={isOwner}
				actions={
					user?.role === 'student' && (
						<FavoriteButton taskId={task.id} isFavorite={task.isFavorite} />
					)
				}
			/>
			{/* TODO(этап 3): форма отправки решения для студента */}
			<TaskActivityTable taskId={task.id} canReview={isOwner} />
		</div>
	)
}
