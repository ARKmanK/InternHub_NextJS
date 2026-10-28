import { defineTranslations } from '@/shared/i18n'

const en = {
	email: 'Email',
	password: 'Password',
	logIn: 'Log in',
	loading: 'Logging in...',
	forgotPassword: 'Forgot password?',
}

const ru = {
	email: 'Почта',
	password: 'Пароль',
	logIn: 'Войти',
	loading: 'Вход...',
	forgotPassword: 'Забыли пароль?',
}

export default defineTranslations({ en, ru })
