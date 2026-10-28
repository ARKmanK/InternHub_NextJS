import { defineTranslations } from '@/shared/i18n'

const en = {
	companyName: 'Company name',
	email: 'Email',
	password: 'Password',
	register: 'Sign up',
	loading: 'Signing up...',
}

const ru = {
	companyName: 'Название компании',
	email: 'Почта',
	password: 'Пароль',
	register: 'Зарегистрироваться',
	loading: 'Регистрация...',
}

export default defineTranslations({ en, ru })
