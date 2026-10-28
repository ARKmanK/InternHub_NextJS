import { defineTranslations } from '@/shared/i18n'

const en = {
	label: 'Notifications',
	empty: 'No new notifications',
	markRead: 'Mark as read',
}

const ru = {
	label: 'Уведомления',
	empty: 'Нет новых уведомлений',
	markRead: 'Отметить прочитанным',
}

export default defineTranslations({ en, ru })
