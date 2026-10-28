import { cookies } from 'next/headers'
import { getRequestConfig } from 'next-intl/server'
import { LOCALE_COOKIE, defaultLocale, isLocale } from '@/shared/i18n'
import { getMessages } from './messages'

/**
 * next-intl без i18n-маршрутизации: адреса без /ru и /en, язык хранится в куке.
 * Файл подключается в next.config.ts через createNextIntlPlugin.
 */
export default getRequestConfig(async () => {
	const cookieStore = await cookies()
	const cookieLocale = cookieStore.get(LOCALE_COOKIE)?.value
	const locale = isLocale(cookieLocale) ? cookieLocale : defaultLocale

	return {
		locale,
		messages: getMessages(locale),
		timeZone: 'Asia/Irkutsk',
		// «Сейчас» для относительного времени («5 минут назад»). Провайдер передаёт это же значение в браузер,
		// поэтому текст на сервере и после гидратации совпадает
		now: new Date(),
	}
})
