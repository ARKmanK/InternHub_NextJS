import { z } from 'zod'
import { ARCHIVE_EXTENSIONS, MAX_FILE_SIZE, hasExtension } from '@/shared/config'
import { IP_TERMS } from './ITask'

// Необязательный текст — пустая строка, а не undefined: так тип входа формы совпадает с типом выхода,
// и react-hook-form не путается в типах
const optionalText = (max: number, error: string) => z.string().trim().max(max, { error })

/**
 * Схема формы задания. Одна и та же схема проверяет данные в форме (клиент)
 * и ещё раз — в server action (сервер), потому что клиенту доверять нельзя.
 * В `error` — ключи из shared/i18n/validation.translations.ts.
 */
export const taskFormSchema = z.object({
	title: z.string().trim().min(3, { error: 'taskTitle' }).max(50, { error: 'taskTitle' }),
	description: z
		.string()
		.trim()
		.min(20, { error: 'taskDescription' })
		.max(3000, { error: 'taskDescription' }),
	expectedResult: optionalText(2000, 'longText'),
	criteria: optionalText(2000, 'longText'),
	difficulty: z.enum(['1', '2', '3'], { error: 'difficulty' }),
	ipTerms: z.enum(IP_TERMS, { error: 'required' }),
	requireRepository: z.boolean(),
	// Пустая строка — без ограничения
	maxParticipants: z
		.string()
		.trim()
		.regex(/^([1-9]\d{0,2})?$/, { error: 'maxParticipants' }),
	deadline: z.date().nullable(),
	tags: z
		.array(z.string().trim().min(2, { error: 'tag' }).max(20, { error: 'tag' }))
		.max(10, { error: 'tagsLimit' }),
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
	expectedResult: '',
	criteria: '',
	difficulty: '1',
	ipTerms: 'open',
	requireRepository: true,
	maxParticipants: '',
	deadline: null,
	tags: [],
	archive: null,
}
