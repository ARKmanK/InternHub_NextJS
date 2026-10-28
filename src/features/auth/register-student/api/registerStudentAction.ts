'use server'

import { notImplemented, type ActionResult } from '@/shared/lib/actionResult'
import {
	registerStudentSchema,
	type RegisterStudentFormValues,
} from '../model/registerStudentSchema'

/**
 * Роль 'student' назначает сервер — клиент её не передаёт и подменить не может.
 * TODO(этап 2): создать пользователя и профиль студента, отправить письмо для подтверждения почты.
 */
export async function registerStudentAction(
	values: RegisterStudentFormValues,
): Promise<ActionResult> {
	const parsed = registerStudentSchema.safeParse(values)
	if (!parsed.success) return { ok: false, error: 'unknownError' }

	return notImplemented()
}
