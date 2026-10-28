import { defineTranslations } from '@/shared/i18n'

const en = {
	email: 'Email',
	password: 'Password',
	logIn: 'Log in',
	loading: 'Logging in...',
}

const ru = {
	email: 'Почта',
	password: 'Пароль',
	logIn: 'Войти',
	loading: 'Вход...',
}

export default defineTranslations({ en, ru })
