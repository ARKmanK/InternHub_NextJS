import { z } from 'zod'
import { ARCHIVE_EXTENSIONS, MAX_FILE_SIZE, hasExtension } from '@/shared/config'

/**
 * Схема формы задания. Используется и формой на клиенте, и server action на сервере (этап 3).
 * В `error` — ключи из shared/i18n/validation.translations.ts.
 */
export const taskFormSchema = z.object({
	title: z.string().trim().min(3, { error: 'taskTitle' }).max(50, { error: 'taskTitle' }),
	description: z
		.string()
		.trim()
		.min(20, { error: 'taskDescription' })
		.max(3000, { error: 'taskDescription' }),
	difficulty: z.enum(['1', '2', '3'], { error: 'difficulty' }),
	deadline: z.date().nullable(),
	tags: z.array(z.string()).max(10, { error: 'tagsLimit' }),
	archive: z
		.instanceof(File)
		.refine(file => file.size <= MAX_FILE_SIZE, { error: 'fileSize' })
		.refine(file => hasExtension(file.name, ARCHIVE_EXTENSIONS), { error: 'fileType' })
		.nullable(),
})

export type TaskFormValues = z.infer<typeof taskFormSchema>

export const emptyTaskForm: TaskFormValues = {
	title: '',
	description: '',
	difficulty: '1',
	deadline: null,
	tags: [],
	archive: null,
}
