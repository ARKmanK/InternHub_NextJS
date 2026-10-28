'use server'

import { notImplemented, type ActionResult } from '@/shared/lib/actionResult'

/**
 * TODO(этап 3): проверить, что задание принадлежит текущему работодателю,
 * удалить (или перевести в 'archived', если по нему уже есть решения) и revalidatePath.
 */
export async function deleteTaskAction(_taskId: number): Promise<ActionResult> {
	return notImplemented()
}
