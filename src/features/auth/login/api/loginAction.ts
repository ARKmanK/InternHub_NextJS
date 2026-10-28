'use server'

import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { auth, getAuthErrorCode } from '@/shared/api'
import { routes } from '@/shared/config'
import type { ActionResult } from '@/shared/lib/actionResult'
import { checkRateLimit, getClientIp } from '@/shared/lib/rateLimit'
import { loginSchema, type LoginFormValues } from '../model/loginSchema'

/**
 * Вход один для всех ролей: роль сервер знает сам по учётной записи.
 * При успехе Better Auth (плагин nextCookies) ставит httpOnly-куку сессии, а мы переходим в профиль.
 */
export async function loginAction(values: LoginFormValues): Promise<ActionResult> {
	if (!checkRateLimit(`login:${await getClientIp()}`, { limit: 10, windowSeconds: 60 })) {
		return { ok: false, error: 'tooManyRequests' }
	}

	const parsed = loginSchema.safeParse(values)
	if (!parsed.success) return { ok: false, error: 'invalidData' }

	try {
		await auth.api.signInEmail({ body: parsed.data, headers: await headers() })
	} catch (error) {
		const code = getAuthErrorCode(error)
		// На неверный пароль и несуществующую почту — одна и та же ошибка: не подсказываем, какие почты зарегистрированы
		if (code === 'INVALID_EMAIL_OR_PASSWORD') return { ok: false, error: 'invalidCredentials' }
		if (code === 'EMAIL_NOT_VERIFIED') return { ok: false, error: 'emailNotVerified' }
		console.error('loginAction', error)
		return { ok: false, error: 'unknownError' }
	}

	// redirect бросает специальное исключение, поэтому он вне try/catch
	redirect(routes.profile())
}
