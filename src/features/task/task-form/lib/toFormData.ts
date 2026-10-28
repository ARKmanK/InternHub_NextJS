import type { TaskFormValues } from '@/entities/task'

/**
 * Форма → FormData. FormData нужна, потому что вместе с полями отправляется файл архива;
 * обычный объект с File внутри в server action не передать.
 */
export const taskFormToFormData = (values: TaskFormValues) => {
	const formData = new FormData()
	formData.set('title', values.title)
	formData.set('description', values.description)
	formData.set('expectedResult', values.expectedResult)
	formData.set('criteria', values.criteria)
	formData.set('difficulty', values.difficulty)
	formData.set('ipTerms', values.ipTerms)
	formData.set('requireRepository', String(values.requireRepository))
	formData.set('maxParticipants', values.maxParticipants)
	if (values.deadline) formData.set('deadline', values.deadline.toISOString())
	values.tags.forEach(tag => formData.append('tags', tag))
	if (values.archive) formData.set('archive', values.archive)
	return formData
}

/** FormData → объект для taskFormSchema. На сервере FormData приходит от клиента, поэтому ничему не доверяем — проверит схема. */
export const formDataToTaskForm = (formData: FormData) => {
	const text = (name: string) => {
		const value = formData.get(name)
		return typeof value === 'string' ? value : ''
	}
	const archive = formData.get('archive')
	const deadline = text('deadline')

	return {
		title: text('title'),
		description: text('description'),
		expectedResult: text('expectedResult'),
		criteria: text('criteria'),
		difficulty: text('difficulty'),
		ipTerms: text('ipTerms'),
		requireRepository: text('requireRepository') === 'true',
		maxParticipants: text('maxParticipants'),
		deadline: deadline ? new Date(deadline) : null,
		tags: formData.getAll('tags').filter(tag => typeof tag === 'string'),
		archive: archive instanceof File && archive.size > 0 ? archive : null,
	}
}
