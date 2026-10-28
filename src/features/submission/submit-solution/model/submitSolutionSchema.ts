import { z } from 'zod'
import { ARCHIVE_EXTENSIONS, IMAGE_EXTENSIONS, MAX_FILE_SIZE, hasExtension } from '@/shared/config'

export const MAX_IMAGES = 5
export const MAX_IMAGE_SIZE = 10 * 1024 * 1024

const repositoryUrl = z.url({ protocol: /^https$/, error: 'repositoryUrl' })

/**
 * Схема решения. Фабрика, потому что правила зависят от задания: работодатель решает,
 * обязательна ли ссылка на репозиторий (для NDA-заданий код обычно сдают архивом).
 * Одна и та же схема — в форме и в server action.
 */
export const createSubmitSolutionSchema = (requireRepository: boolean) =>
	z.object({
		repositoryUrl: requireRepository
			? repositoryUrl
			: z.union([z.literal(''), repositoryUrl], { error: 'repositoryUrl' }),
		comment: z.string().trim().max(2000, { error: 'comment' }),
		archive: z
			.instanceof(File)
			.refine(file => file.size <= MAX_FILE_SIZE, { error: 'fileSize' })
			.refine(file => hasExtension(file.name, ARCHIVE_EXTENSIONS), { error: 'fileType' })
			.nullable(),
		images: z
			.array(
				z
					.instanceof(File)
					.refine(file => file.size <= MAX_IMAGE_SIZE, { error: 'imageSize' })
					.refine(file => hasExtension(file.name, IMAGE_EXTENSIONS), { error: 'fileType' }),
			)
			.max(MAX_IMAGES, { error: 'imagesLimit' }),
	})

export type SubmitSolutionValues = z.infer<ReturnType<typeof createSubmitSolutionSchema>>

export const emptySolution: SubmitSolutionValues = {
	repositoryUrl: '',
	comment: '',
	archive: null,
	images: [],
}

export const solutionToFormData = (values: SubmitSolutionValues) => {
	const formData = new FormData()
	formData.set('repositoryUrl', values.repositoryUrl)
	formData.set('comment', values.comment)
	if (values.archive) formData.set('archive', values.archive)
	values.images.forEach(image => formData.append('images', image))
	return formData
}

export const formDataToSolution = (formData: FormData) => {
	const text = (name: string) => {
		const value = formData.get(name)
		return typeof value === 'string' ? value : ''
	}
	const archive = formData.get('archive')
	return {
		repositoryUrl: text('repositoryUrl').trim(),
		comment: text('comment'),
		archive: archive instanceof File && archive.size > 0 ? archive : null,
		images: formData
			.getAll('images')
			.filter((image): image is File => image instanceof File && image.size > 0),
	}
}
