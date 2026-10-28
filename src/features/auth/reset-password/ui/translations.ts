import { defineTranslations } from '@/shared/i18n'

const en = {
	forgotTitle: 'Password recovery',
	forgotDescription:
		'Enter the email you registered with — we will send a link to set a new password',
	email: 'Email',
	send: 'Send link',
	resetTitle: 'New password',
	password: 'New password',
	confirmPassword: 'Repeat the password',
	save: 'Save password',
	sending: 'Sending...',
	doneTitle: 'Password changed',
	doneDescription: 'Log in with the new password. You have been logged out on all other devices.',
	toLogin: 'Log in',
	invalidLinkTitle: 'The link does not work',
	invalidLinkDescription: 'It may have expired or already been used. Request a new one.',
	requestNew: 'Request a new link',
}

const ru = {
	forgotTitle: 'Восстановление пароля',
	forgotDescription:
		'Укажите почту, с которой регистрировались, — пришлём ссылку для нового пароля',
	email: 'Почта',
	send: 'Отправить ссылку',
	resetTitle: 'Новый пароль',
	password: 'Новый пароль',
	confirmPassword: 'Повторите пароль',
	save: 'Сохранить пароль',
	sending: 'Отправка...',
	doneTitle: 'Пароль изменён',
	doneDescription: 'Войдите с новым паролем. На остальных устройствах сеанс завершён.',
	toLogin: 'Войти',
	invalidLinkTitle: 'Ссылка не работает',
	invalidLinkDescription: 'Возможно, она устарела или уже была использована. Запросите новую.',
	requestNew: 'Запросить новую ссылку',
}

export default defineTranslations({ en, ru })
