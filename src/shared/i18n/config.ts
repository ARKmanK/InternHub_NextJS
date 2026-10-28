export const locales = ['ru', 'en'] as const

export type Locale = (typeof locales)[number]

export const defaultLocale: Locale = 'ru'

// Имя куки совпадает с тем, что next-intl использует по умолчанию
export const LOCALE_COOKIE = 'NEXT_LOCALE'

export const isLocale = (value: unknown): value is Locale =>
	typeof value === 'string' && (locales as readonly string[]).includes(value)
