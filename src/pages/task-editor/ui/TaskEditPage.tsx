import { notFound, redirect } from 'next/navigation'
import { routes } from '@/shared/config'
import { getTags } from '@/entities/tag/index.server'
import { getTaskById } from '@/entities/task/index.server'
import { getCurrentUser } from '@/entities/user/index.server'
import { TaskForm } from '@/features/task/task-form'

// Закрытое и архивное задание не редактируется (то же правило проверяет server action)
const EDITABLE = ['draft', 'moderation', 'published']

export async function TaskEditPage({ id }: { id: number }) {
	const user = await getCurrentUser()
	if (user?.role !== 'employer' || user.organization?.status !== 'verified') {
		redirect(routes.profile())
	}

	const [task, tags] = await Promise.all([getTaskById(id, user), getTags()])
	// Чужое задание выглядит так же, как несуществующее — не раскрываем, что оно есть
	if (!task || task.authorId !== user.id) notFound()
	if (!EDITABLE.includes(task.status)) redirect(routes.task(task.id))

	return (
		<TaskForm
			mode='edit'
			taskId={task.id}
			tagSuggestions={tags.map(tag => tag.label)}
			hasArchive={task.hasArchive}
			defaultValues={{
				title: task.title,
				description: task.description,
				expectedResult: task.expectedResult ?? '',
				criteria: task.criteria ?? '',
				difficulty: String(task.difficulty) as '1' | '2' | '3',
				ipTerms: task.ipTerms,
				requireRepository: task.requireRepository,
				maxParticipants: task.maxParticipants ? String(task.maxParticipants) : '',
				deadline: task.deadline ? new Date(task.deadline) : null,
				tags: task.tags,
				archive: null,
			}}
		/>
	)
}
