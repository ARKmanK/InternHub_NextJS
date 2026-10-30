/**
 * События, которые realtime-сервер доставляет в браузер. Сервер их не разбирает —
 * просто пересылает адресатам, поэтому формат знают только приложение и клиент.
 *
 * События — сигналы, а не данные для доверия: клиент по ним обновляет то, что видит,
 * а права и содержимое всё равно проверяет сервер приложения.
 */
export type RealtimeEvent =
	/** Появилось новое уведомление — колокольчику пора перезапросить список */
	| { type: 'notification' }
	/** Новое сообщение в чате */
	| {
			type: 'message'
			conversationId: number
			message: { id: number; authorId: string; text: string; createdAt: string }
	  }

export type RealtimeEventType = RealtimeEvent['type']
