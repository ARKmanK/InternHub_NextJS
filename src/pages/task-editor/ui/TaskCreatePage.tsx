import { redirect } from 'next/navigation'
import { routes } from '@/shared/config'
import { getTags } from '@/entities/tag/index.server'
import { getCurrentUser } from '@/entities/user/index.server'
import { TaskForm } from '@/features/task/task-form'

export async function TaskCreatePage() {
	const user = await getCurrentUser()
	// TODO(этап 2): перенести проверку роли в layout группы маршрутов работодателя
	if (user?.role !== 'employer') redirect(routes.profile())

	const tags = await getTags()

	return <TaskForm mode='create' tagSuggestions={tags.map(tag => tag.label)} />
}
