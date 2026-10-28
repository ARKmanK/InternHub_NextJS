import type { Locale } from '@/shared/i18n'
import type { Messages } from './messages'

// Типизация next-intl: опечатка в namespace или ключе — ошибка компиляции, а не пустая строка на экране
declare module 'next-intl' {
	interface AppConfig {
		Locale: Locale
		Messages: Messages
	}
}
