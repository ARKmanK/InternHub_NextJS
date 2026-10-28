import { getTaskById } from '@/entities/task/index.server'
import { getCurrentUser } from '@/entities/user/index.server'

/** Заголовок вкладки. Тот же запрос, что и у страницы, — благодаря React cache() в базу он уходит один раз. */
export async function getTaskPageTitle(id: number): Promise<string | null> {
	const task = await getTaskById(id, await getCurrentUser())
	return task?.title ?? null
}
