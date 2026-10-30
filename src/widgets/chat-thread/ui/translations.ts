import { defineTranslations } from '@/shared/i18n'

const en = {
	label: 'Chat with {name}',
	older: 'Show earlier messages',
	empty: 'Start the conversation with {name}',
}

const ru = {
	label: 'Переписка: {name}',
	older: 'Показать более ранние',
	empty: 'Начните переписку: {name}',
}

export default defineTranslations({ en, ru })
