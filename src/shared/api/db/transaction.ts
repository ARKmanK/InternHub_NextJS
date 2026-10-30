import 'server-only'
import { db } from './client'
import type { Prisma } from './generated/client'

type Callback = () => void

// Отложенные действия каждой открытой транзакции. WeakMap — запись исчезнет вместе с объектом tx
const pending = new WeakMap<Prisma.TransactionClient, Callback[]>()

/**
 * Интерактивная транзакция, после фиксации которой выполняются действия из afterCommit.
 * Пример: realtime-событие «новое уведомление» нельзя отправлять изнутри транзакции —
 * клиент перезапросит список раньше, чем данные станут видны, или транзакция вообще откатится.
 */
export async function transaction<T>(fn: (tx: Prisma.TransactionClient) => Promise<T>): Promise<T> {
	const callbacks: Callback[] = []
	const result = await db.$transaction(async tx => {
		pending.set(tx, callbacks)
		return fn(tx)
	})
	for (const callback of callbacks) {
		try {
			callback()
		} catch (error) {
			// Побочные действия после коммита не должны ломать уже выполненную операцию
			console.error('afterCommit', error)
		}
	}
	return result
}

/**
 * Выполнить действие после фиксации транзакции `client`. Если `client` — не транзакция
 * из transaction() (обычный db), действие выполняется сразу: данные уже записаны.
 */
export function afterCommit(client: Prisma.TransactionClient, callback: Callback) {
	const callbacks = pending.get(client)
	if (callbacks) callbacks.push(callback)
	else callback()
}
