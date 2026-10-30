import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { Download, Pencil } from 'lucide-react'
import { routes } from '@/shared/config'
import { BackButton } from '@/shared/ui/back-button'
import { Button } from '@/shared/ui/button'
import { TaskCard } from '@/entities/task'
import { getTaskById } from '@/entities/task/index.server'
import { getCurrentUser } from '@/entities/user/index.server'
import { WriteMessageButton } from '@/features/chat/start-conversation'
import { CloseTaskButton } from '@/features/task/close-task'
import { TaskDeleteDialog } from '@/features/task/task-delete'
import { ModerationActions } from '@/features/task/task-moderation'
import { FavoriteButton } from '@/features/task/toggle-favorite'
import { TaskActivityTable } from '@/widgets/task-activity'
import { TaskApplications } from '@/widgets/task-applications'
import { TaskParticipation } from '@/widgets/task-participation'

const EDITABLE = ['draft', 'moderation', 'published']

/**
 * Страница задания. Одна страница — разное содержимое по ролям:
 * студент — заявка и сдача решения; автор — управление заданием, заявки и проверка решений;
 * администратор — модерация. Что именно разрешено, всё равно проверяют server actions.
 */
export async function TaskPage({ id }: { id: number }) {
	const t = await getTranslations('TaskPage')
	const user = await getCurrentUser()
	// Черновик или задание на модерации вернётся только автору и админу — остальным 404
	const task = await getTaskById(id, user)
	if (!task) notFound()

	const isOwner = user?.role === 'employer' && user.id === task.authorId
	const isStudent = user?.role === 'student'
	const isAdmin = user?.role === 'admin'

	const ownerActions = isOwner && (
		<>
			{EDITABLE.includes(task.status) && (
				<Button asChild variant='ghost' size='icon' aria-label={t('edit')}>
					<Link href={routes.taskEdit(task.id)}>
						<Pencil />
					</Link>
				</Button>
			)}
			<TaskDeleteDialog taskId={task.id} taskTitle={task.title} />
		</>
	)

	return (
		<div className='flex flex-col gap-6'>
			<div className='flex flex-wrap items-center justify-between gap-2'>
				<BackButton />
				<div className='flex flex-wrap gap-2'>
					{/* Вопрос по заданию — напрямую автору */}
					{user && !isOwner && <WriteMessageButton peerId={task.authorId} />}
					{task.hasArchive && (
						<Button asChild variant='outline' size='sm'>
							<a href={routes.taskArchive(task.id)}>
								<Download /> {t('materials')}
							</a>
						</Button>
					)}
					{isOwner && task.status === 'published' && <CloseTaskButton taskId={task.id} />}
					{isAdmin && task.status === 'moderation' && <ModerationActions taskId={task.id} />}
				</div>
			</div>

			<TaskCard
				task={task}
				variant='full'
				isMine={isOwner}
				showStatus={isOwner || isAdmin}
				actions={
					isStudent ? (
						<FavoriteButton taskId={task.id} isFavorite={task.isFavorite} />
					) : (
						ownerActions
					)
				}
			/>

			{isStudent && <TaskParticipation task={task} studentId={user.id} />}
			{!user && task.status === 'published' && (
				<p className='text-sm text-muted-foreground'>
					<Link href={routes.profile()} className='underline'>
						{t('loginToApply')}
					</Link>
				</p>
			)}
			{isOwner && <TaskApplications taskId={task.id} maxParticipants={task.maxParticipants} />}
			<TaskActivityTable taskId={task.id} canReview={isOwner} />
		</div>
	)
}
