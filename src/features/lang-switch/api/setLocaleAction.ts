'use server'

import { cookies } from 'next/headers'
import { db } from '@/shared/api'
import { LOCALE_COOKIE, isLocale } from '@/shared/i18n'
import { getCurrentUser } from '@/entities/user/index.server'

const ONE_YEAR = 60 * 60 * 24 * 365

/**
 * Язык хранится в куке: так его видит сервер и рендерит страницу сразу на нужном языке.
 * Вошедшему пользователю язык сохраняется и в профиле — на нём придут письма, и он вернётся при входе с другого устройства.
 */
export async function setLocaleAction(locale: string) {
	if (!isLocale(locale)) return

	const cookieStore = await cookies()
	cookieStore.set(LOCALE_COOKIE, locale, { path: '/', maxAge: ONE_YEAR, sameSite: 'lax' })

	const user = await getCurrentUser()
	if (user) await db.user.update({ where: { id: user.id }, data: { locale } })
}
