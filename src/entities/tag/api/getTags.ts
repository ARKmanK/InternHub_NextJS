import { db } from '@/shared/api'
import type { ITag } from '../model/ITag'

/** Все теги — подсказки при создании задания. Вызывается только на сервере. */
export async function getTags(): Promise<ITag[]> {
	const tags = await db.tag.findMany({ orderBy: { name: 'asc' } })
	return tags.map(tag => ({ id: tag.id, label: tag.name }))
}
