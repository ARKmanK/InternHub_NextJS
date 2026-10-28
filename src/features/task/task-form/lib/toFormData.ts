import type { TaskFormValues } from '@/entities/task'

export const taskFormToFormData = (values: TaskFormValues) => {
	const formData = new FormData()
	formData.set('title', values.title)
	formData.set('description', values.description)
	formData.set('difficulty', values.difficulty)
	if (values.deadline) formData.set('deadline', values.deadline.toISOString())
	values.tags.forEach(tag => formData.append('tags', tag))
	if (values.archive) formData.set('archive', values.archive)
	return formData
}
