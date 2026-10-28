'use server'

import { notImplemented, type ActionResult } from '@/shared/lib/actionResult'

/**
 * Форма отправляет FormData: в ней можно передать файл архива.
 * TODO(этап 3):
 *  1. достать пользователя из сессии и проверить, что он верифицированный работодатель;
 *  2. разобрать FormData и проверить через taskFormSchema из entities/task;
 *  3. сохранить архив в хранилище, задание — через Prisma со статусом 'moderation';
 *  4. revalidatePath и redirect на страницу задания.
 */
export async function createTaskAction(_formData: FormData): Promise<ActionResult<{ id: number }>> {
	return notImplemented()
}

/** TODO(этап 3): то же, плюс проверка, что задание принадлежит этому работодателю. */
export async function updateTaskAction(
	_taskId: number,
	_formData: FormData,
): Promise<ActionResult<{ id: number }>> {
	return notImplemented()
}
