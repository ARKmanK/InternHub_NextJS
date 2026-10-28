import type { IUser } from '../model/IUser'

/**
 * Текущий пользователь из сессии. Вызывается только на сервере.
 * TODO(этап 2): читать сессию из библиотеки авторизации и профиль через Prisma.
 */
export async function getCurrentUser(): Promise<IUser | null> {
	return null
}
