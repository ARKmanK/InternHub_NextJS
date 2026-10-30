import { defineTranslations } from '@/shared/i18n'

const en = {
	label: 'Message',
	placeholder: 'Write a message… (Shift+Enter — new line)',
	send: 'Send',
}

const ru = {
	label: 'Сообщение',
	placeholder: 'Напишите сообщение… (Shift+Enter — новая строка)',
	send: 'Отправить',
}

export default defineTranslations({ en, ru })
