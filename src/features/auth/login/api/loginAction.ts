'use server'

import { notImplemented, type ActionResult } from '@/shared/lib/actionResult'
import { loginSchema, type LoginFormValues } from '../model/loginSchema'

/**
 * Вход один для всех ролей: роль определяет сервер по учётной записи.
 * TODO(этап 2): проверить пароль через библиотеку авторизации, создать сессию, redirect в профиль.
 */
export async function loginAction(values: LoginFormValues): Promise<ActionResult> {
	const parsed = loginSchema.safeParse(values)
	if (!parsed.success) return { ok: false, error: 'unknownError' }

	return notImplemented()
}
