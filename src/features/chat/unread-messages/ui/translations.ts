import { defineTranslations } from '@/shared/i18n'

const en = {
	label: 'Messages',
	labelUnread: 'Messages: {count} unread',
}

const ru = {
	label: 'Сообщения',
	labelUnread: 'Сообщения: непрочитанных {count}',
}

export default defineTranslations({ en, ru })
