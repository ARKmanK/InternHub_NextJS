import { defineTranslations } from '@/shared/i18n'

const en = {
	login: 'Log in',
	register: 'Sign up',
	student: 'Student',
	employer: 'Employer',
}

const ru = {
	login: 'Вход',
	register: 'Регистрация',
	student: 'Студент',
	employer: 'Работодатель',
}

export default defineTranslations({ en, ru })
