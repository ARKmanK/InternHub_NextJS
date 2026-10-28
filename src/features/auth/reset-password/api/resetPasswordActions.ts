'use server'

import { headers } from 'next/headers'
import { auth, getAuthErrorCode } from '@/shared/api'
import { routes } from '@/shared/config'
import type { ActionResult } from '@/shared/lib/actionResult'
import { checkRateLimit, getClientIp } from '@/shared/lib/rateLimit'
import {
	forgotPasswordSchema,
	resetPasswordSchema,
	type ForgotPasswordValues,
	type ResetPasswordValues,
} from '../model/resetPasswordSchemas'

/**
 * Запрос письма со ссылкой для сброса пароля. Ответ всегда одинаковый, есть такая почта или нет:
 * иначе по ответу можно было бы узнать, кто зарегистрирован.
 */
export async function requestPasswordResetAction(
	values: ForgotPasswordValues,
): Promise<ActionResult> {
	if (!checkRateLimit(`reset:${await getClientIp()}`, { limit: 5, windowSeconds: 60 })) {
		return { ok: false, error: 'tooManyRequests' }
	}

	const parsed = forgotPasswordSchema.safeParse(values)
	if (!parsed.success) return { ok: false, error: 'invalidData' }

	try {
		await auth.api.requestPasswordReset({
			// Ссылка из письма ведёт на /api/auth/reset-password/<token>, а оттуда — на нашу страницу с ?token=
			body: { email: parsed.data.email, redirectTo: routes.resetPassword() },
			headers: await headers(),
		})
	} catch (error) {
		console.error('requestPasswordResetAction', getAuthErrorCode(error) ?? error)
	}

	return { ok: true, data: undefined }
}

/** Новый пароль по токену из письма. Все сессии пользователя при этом завершаются (revokeSessionsOnPasswordReset). */
export async function resetPasswordAction(
	token: string,
	values: ResetPasswordValues,
): Promise<ActionResult> {
	const parsed = resetPasswordSchema.safeParse(values)
	if (!parsed.success || !token) return { ok: false, error: 'invalidData' }

	try {
		await auth.api.resetPassword({
			body: { token, newPassword: parsed.data.password },
			headers: await headers(),
		})
	} catch (error) {
		if (getAuthErrorCode(error) === 'INVALID_TOKEN') return { ok: false, error: 'invalidToken' }
		console.error('resetPasswordAction', error)
		return { ok: false, error: 'unknownError' }
	}

	return { ok: true, data: undefined }
}
