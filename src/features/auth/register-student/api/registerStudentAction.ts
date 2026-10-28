'use server'

import { db, getAuthErrorCode, signUpWithEmail } from '@/shared/api'
import { routes } from '@/shared/config'
import type { ActionResult } from '@/shared/lib/actionResult'
import { checkRateLimit, getClientIp } from '@/shared/lib/rateLimit'
import {
	registerStudentSchema,
	type RegisterStudentFormValues,
} from '../model/registerStudentSchema'

/**
 * Регистрация студента: учётная запись (Better Auth) + профиль с группой и курсом.
 * Роль 'STUDENT' — значение по умолчанию в базе; клиент роль не передаёт и подменить её не может.
 * После регистрации войти нельзя, пока не подтверждена почта — Better Auth уже отправил письмо.
 */
export async function registerStudentAction(
	values: RegisterStudentFormValues,
): Promise<ActionResult> {
	if (!checkRateLimit(`register:${await getClientIp()}`, { limit: 5, windowSeconds: 60 })) {
		return { ok: false, error: 'tooManyRequests' }
	}

	const parsed = registerStudentSchema.safeParse(values)
	if (!parsed.success) return { ok: false, error: 'invalidData' }
	const { firstName, lastName, group, course, email, password } = parsed.data

	let signUp
	try {
		signUp = await signUpWithEmail({
			name: `${firstName} ${lastName}`,
			email,
			password,
			callbackURL: routes.profile(),
		})
	} catch (error) {
		console.error('registerStudentAction', getAuthErrorCode(error) ?? error)
		return { ok: false, error: 'unknownError' }
	}

	// Почта занята: отвечаем так же, как при успехе (владелец получит письмо-предупреждение)
	if (signUp.status === 'existing') return { ok: true, data: undefined }

	try {
		await db.studentProfile.create({
			data: { userId: signUp.userId, firstName, lastName, group, course: Number(course) },
		})
	} catch (error) {
		// Профиль не создался — удаляем пользователя, чтобы не осталась учётная запись без профиля
		await db.user.delete({ where: { id: signUp.userId } }).catch(() => {})
		console.error('registerStudentAction: profile', error)
		return { ok: false, error: 'unknownError' }
	}

	return { ok: true, data: undefined }
}
