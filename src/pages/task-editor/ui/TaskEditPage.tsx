import { notFound, redirect } from 'next/navigation'
import { routes } from '@/shared/config'
import { getTags } from '@/entities/tag/index.server'
import { getTaskById } from '@/entities/task/index.server'
import { getCurrentUser } from '@/entities/user/index.server'
import { TaskForm } from '@/features/task/task-form'

export async function TaskEditPage({ id }: { id: number }) {
	const user = await getCurrentUser()
	if (user?.role !== 'employer') redirect(routes.profile())

	const [task, tags] = await Promise.all([getTaskById(id), getTags()])
	// Чужое задание выглядит так же, как несуществующее — не раскрываем, что оно есть
	if (!task || task.employerId !== user.id) notFound()

	return (
		<TaskForm
			mode='edit'
			taskId={task.id}
			tagSuggestions={tags.map(tag => tag.label)}
			defaultValues={{
				title: task.title,
				description: task.description,
				difficulty: String(task.difficulty) as '1' | '2' | '3',
				deadline: task.deadline ? new Date(task.deadline) : null,
				tags: task.tags,
				archive: null,
			}}
		/>
	)
}
