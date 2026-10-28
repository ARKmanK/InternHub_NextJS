'use server'

import { taskFiltersSchema, type TasksPage } from '@/entities/task'
import { getTasks } from '@/entities/task/index.server'
import { getCurrentUser } from '@/entities/user/index.server'

/**
 * Server action — это публичный POST-эндпоинт, поэтому аргументы проверяются заново,
 * даже если клиент «наш». Зритель берётся из сессии, а не из аргументов.
 */
export async function loadMoreTasks(rawFilters: unknown, offset: number): Promise<TasksPage> {
	const filters = taskFiltersSchema.parse(rawFilters)
	const safeOffset = Number.isInteger(offset) && offset >= 0 ? offset : 0
	const user = await getCurrentUser()
	return getTasks(filters, safeOffset, user)
}
