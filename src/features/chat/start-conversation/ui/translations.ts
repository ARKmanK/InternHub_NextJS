import { defineTranslations } from '@/shared/i18n'

const en = {
	write: 'Message',
	writeTo: 'Message {name}',
	byEmail: 'New chat: email',
	start: 'Start chat',
}

const ru = {
	write: 'Написать',
	writeTo: 'Написать: {name}',
	byEmail: 'Новый чат: почта',
	start: 'Начать переписку',
}

export default defineTranslations({ en, ru })
