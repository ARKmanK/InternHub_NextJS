import { defineTranslations } from '@/shared/i18n'

const en = {
	title: 'Messages',
	empty:
		'No chats yet. Start one by email or with the “Message” button on a task, portfolio or practice page',
}

const ru = {
	title: 'Сообщения',
	empty:
		'Чатов пока нет. Начните переписку по почте или кнопкой «Написать» на странице задания, портфолио или практики',
}

export default defineTranslations({ en, ru })
