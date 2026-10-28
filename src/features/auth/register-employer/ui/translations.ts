import { defineTranslations } from '@/shared/i18n'

const en = {
	contactName: 'Your name',
	companyName: 'Organization name',
	inn: 'INN',
	ogrn: 'OGRN (optional)',
	email: 'Work email',
	password: 'Password',
	hint: 'The administrator will check the organization by INN. Until then you cannot publish tasks.',
	register: 'Sign up',
	loading: 'Signing up...',
}

const ru = {
	contactName: 'Ваше имя',
	companyName: 'Название организации',
	inn: 'ИНН',
	ogrn: 'ОГРН (необязательно)',
	email: 'Рабочая почта',
	password: 'Пароль',
	hint: 'Администратор проверит организацию по ИНН. До проверки публиковать задания нельзя.',
	register: 'Зарегистрироваться',
	loading: 'Регистрация...',
}

export default defineTranslations({ en, ru })
