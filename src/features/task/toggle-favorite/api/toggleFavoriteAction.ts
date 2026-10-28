'use server'

import { notImplemented, type ActionResult } from '@/shared/lib/actionResult'

/**
 * Избранное хранится в БД (раньше — в redux-persist, то есть только в одном браузере).
 * TODO(этап 3): только для student; добавить/удалить запись, обновить счётчик отслеживаний.
 */
export async function toggleFavoriteAction(
	_taskId: number,
	_isFavorite: boolean,
): Promise<ActionResult> {
	return notImplemented()
}
