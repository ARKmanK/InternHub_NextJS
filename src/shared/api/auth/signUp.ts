import 'server-only'
import { cookies, headers } from 'next/headers'
import { defaultLocale, isLocale, LOCALE_COOKIE } from '@/shared/i18n'
import { db } from '../db'
import { auth } from './auth'

export type SignUpResult =
	/** Новый пользователь создан, письмо для подтверждения отправлено */
	| { status: 'created'; userId: string }
	/** Почта уже занята. Ответ клиенту должен быть таким же, как при успехе: нельзя раскрывать, кто зарегистрирован */
	| { status: 'existing' }

/**
 * Регистрация через Better Auth. Язык берётся из текущей куки — письмо подтверждения придёт на нём же.
 *
 * При включённом подтверждении почты на занятый адрес Better Auth возвращает «синтетического» пользователя
 * с выдуманным id, которого нет в базе. Отличаем этот случай проверкой по базе,
 * чтобы не создавать профиль для несуществующего пользователя.
 */
export async function signUpWithEmail(data: {
	name: string
	email: string
	password: string
	callbackURL: string
}): Promise<SignUpResult> {
	const cookieLocale = (await cookies()).get(LOCALE_COOKIE)?.value
	const locale = isLocale(cookieLocale) ? cookieLocale : defaultLocale

	const result = await auth.api.signUpEmail({
		body: { ...data, locale },
		headers: await headers(),
	})

	const exists = await db.user.findUnique({ where: { id: result.user.id }, select: { id: true } })
	return exists ? { status: 'created', userId: exists.id } : { status: 'existing' }
}
