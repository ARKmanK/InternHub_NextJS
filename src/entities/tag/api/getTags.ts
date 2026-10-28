import type { ITag } from '../model/ITag'

/** Стандартные теги для выбора при создании задачи и в фильтре. TODO(этап 1): Prisma. */
export async function getTags(): Promise<ITag[]> {
	return []
}
