import type { Locale } from './config'

/**
 * Обёртка для файлов translations.ts рядом с компонентами.
 * Ничего не делает в рантайме, но проверяет, что во всех языках одинаковый набор ключей:
 * если в `en` забыли ключ, который есть в `ru` (или наоборот), будет ошибка компиляции.
 *
 * Файл подключается к next-intl через реестр в `src/app/i18n/messages.ts`.
 */
export const defineTranslations = <const Key extends string>(
	translations: Record<Locale, Record<Key, string>>,
) => translations
