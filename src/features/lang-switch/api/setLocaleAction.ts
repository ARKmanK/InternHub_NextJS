'use server'

import { cookies } from 'next/headers'
import { LOCALE_COOKIE, isLocale } from '@/shared/i18n'

const ONE_YEAR = 60 * 60 * 24 * 365

/** Язык хранится в куке: так его видит сервер и рендерит страницу сразу на нужном языке. */
export async function setLocaleAction(locale: string) {
	if (!isLocale(locale)) return

	const cookieStore = await cookies()
	cookieStore.set(LOCALE_COOKIE, locale, { path: '/', maxAge: ONE_YEAR, sameSite: 'lax' })
}
