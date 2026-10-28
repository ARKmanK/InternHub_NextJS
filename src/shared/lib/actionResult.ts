import type { CommonKey } from '@/shared/i18n'

/**
 * Единый формат ответа server action. В `error` — ключ из common.translations.ts,
 * чтобы клиент показал сообщение на текущем языке.
 */
export type ActionResult<Data = undefined> =
	{ ok: true; data: Data } | { ok: false; error: CommonKey }

export const notImplemented = (): ActionResult<never> => ({ ok: false, error: 'notImplemented' })
