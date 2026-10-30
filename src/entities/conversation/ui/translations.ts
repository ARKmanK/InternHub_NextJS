import { defineTranslations } from '@/shared/i18n'

const en = {
	you: 'You',
	noMessages: 'No messages yet',
	unread: '{count, plural, one {# unread message} other {# unread messages}}',
	student: 'Student',
	employer: 'Employer',
	teacher: 'Teacher',
	admin: 'Administrator',
}

const ru = {
	you: 'Вы',
	noMessages: 'Сообщений пока нет',
	unread:
		'{count, plural, one {# непрочитанное сообщение} few {# непрочитанных сообщения} other {# непрочитанных сообщений}}',
	student: 'Студент',
	employer: 'Работодатель',
	teacher: 'Преподаватель',
	admin: 'Администратор',
}

export default defineTranslations({ en, ru })
