import { redirect } from 'next/navigation'
import { routes } from '@/shared/config'
import { getCompetencies } from '@/entities/competency/index.server'
import { getTags } from '@/entities/tag/index.server'
import { getCurrentUser } from '@/entities/user/index.server'
import { TaskForm } from '@/features/task/task-form'

export async function TaskCreatePage() {
	const user = await getCurrentUser()
	// Публиковать может только работодатель подтверждённой организации; остальных — в кабинет,
	// где видно, почему (не вошёл / организация на проверке). Server action повторит эту проверку (этап 3).
	if (user?.role !== 'employer' || user.organization?.status !== 'verified') {
		redirect(routes.profile())
	}

	const [tags, competencies] = await Promise.all([getTags(), getCompetencies()])

	return (
		<TaskForm
			mode='create'
			tagSuggestions={tags.map(tag => tag.label)}
			competencyOptions={competencies}
		/>
	)
}
