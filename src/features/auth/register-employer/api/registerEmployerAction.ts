'use server'

import { notImplemented, type ActionResult } from '@/shared/lib/actionResult'
import {
	registerEmployerSchema,
	type RegisterEmployerFormValues,
} from '../model/registerEmployerSchema'

/**
 * Роль 'employer' назначает сервер.
 * TODO(этап 2): создать пользователя и организацию со статусом «на проверке», отправить письмо.
 */
export async function registerEmployerAction(
	values: RegisterEmployerFormValues,
): Promise<ActionResult> {
	const parsed = registerEmployerSchema.safeParse(values)
	if (!parsed.success) return { ok: false, error: 'unknownError' }

	return notImplemented()
}
