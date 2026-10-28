import { defineTranslations } from '@/shared/i18n'

const en = {
	firstName: 'First name',
	lastName: 'Last name',
	group: 'Group',
	course: 'Course',
	chooseCourse: 'Choose course',
	email: 'Email',
	password: 'Password',
	register: 'Sign up',
	loading: 'Signing up...',
}

const ru = {
	firstName: 'Имя',
	lastName: 'Фамилия',
	group: 'Группа',
	course: 'Курс',
	chooseCourse: 'Выберите курс',
	email: 'Почта',
	password: 'Пароль',
	register: 'Зарегистрироваться',
	loading: 'Регистрация...',
}

export default defineTranslations({ en, ru })
