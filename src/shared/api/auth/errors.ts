import { isAPIError } from 'better-auth/api'

/** Код ошибки Better Auth (EMAIL_NOT_VERIFIED, INVALID_EMAIL_OR_PASSWORD, ...) или null, если это другая ошибка. */
export const getAuthErrorCode = (error: unknown): string | null =>
	isAPIError(error) ? (error.body?.code ?? null) : null
