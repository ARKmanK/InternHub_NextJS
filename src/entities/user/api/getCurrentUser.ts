import type { IUser } from '../model/IUser'

/**
 * Текущий пользователь из сессии. Вызывается только на сервере.
 * TODO(этап 2): получить сессию Better Auth и прочитать пользователя через Prisma
 * (роль — из таблицы users, а не из данных, которые прислал клиент).
 */
export async function getCurrentUser(): Promise<IUser | null> {
	return null
}
