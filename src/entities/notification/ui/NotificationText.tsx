import { useTranslations } from 'next-intl'
import type { INotification } from '../model/INotification'

/** Заголовок и текст уведомления на языке читателя (из типа и параметров). */
export function useNotificationText({ type, params }: Pick<INotification, 'type' | 'params'>) {
	const t = useTranslations('NotificationText')
	// ICU-подстановки обязательны: передаём все, отсутствующие — пустой строкой
	const values = {
		taskTitle: params.taskTitle ?? '',
		studentName: params.studentName ?? '',
	}

	return {
		title: t(`${type}_title`),
		body: t(`${type}_body`, values),
		comment: params.comment ?? null,
	}
}
