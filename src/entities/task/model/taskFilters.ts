import { z } from 'zod'

/**
 * Фильтры ленты задач живут в адресной строке (?difficulty=2&tags=react,sql&company=5):
 * ссылкой можно поделиться, а сервер сразу отдаёт отфильтрованный список.
 */
const listParam = z
	.string()
	.optional()
	.transform(value => (value ? value.split(',').filter(Boolean) : []))

export const taskFiltersSchema = z.object({
	difficulty: z.enum(['1', '2', '3']).optional().catch(undefined),
	company: z.string().optional().catch(undefined),
	tags: listParam.catch([]),
})

export type TaskFilters = z.infer<typeof taskFiltersSchema>

export type TaskSearchParams = Record<string, string | string[] | undefined>

export const parseTaskFilters = (searchParams: TaskSearchParams): TaskFilters => {
	const single = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value)

	return taskFiltersSchema.parse({
		difficulty: single(searchParams.difficulty),
		company: single(searchParams.company),
		tags: single(searchParams.tags),
	})
}

export const TASKS_PAGE_SIZE = 10
