'use server'

import { taskFiltersSchema, type TasksPage } from '@/entities/task'
import { getTasks } from '@/entities/task/index.server'

/**
 * Server action — это публичный POST-эндпоинт, поэтому аргументы проверяются заново,
 * даже если клиент «наш».
 */
export async function loadMoreTasks(rawFilters: unknown, offset: number): Promise<TasksPage> {
	const filters = taskFiltersSchema.parse(rawFilters)
	const safeOffset = Number.isInteger(offset) && offset >= 0 ? offset : 0
	return getTasks(filters, safeOffset)
}
