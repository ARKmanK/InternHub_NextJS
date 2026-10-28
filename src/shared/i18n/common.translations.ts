import { defineTranslations } from './define-translations'

/** Общие строки, которые нужны многим компонентам. */
const en = {
	back: 'Back',
	cancel: 'Cancel',
	save: 'Save',
	loading: 'Loading...',
	loadMore: 'Show more',
	empty: 'Nothing here yet',
	notImplemented: 'This feature will be available soon',
	unknownError: 'Something went wrong. Please try again',
	forbidden: 'Not enough rights',
	invalidData: 'Check the form fields',
	tooManyRequests: 'Too many attempts. Please wait a minute and try again',
	invalidCredentials: 'Wrong email or password',
	emailNotVerified: 'Confirm your email first — we sent you a link',
	innTaken: 'An organization with this INN is already registered. Contact the administrator',
	invalidToken: 'The link is invalid or expired. Request a new one',
	noSlots: 'All places for this task are taken',
	checkEmailTitle: 'Check your email',
	checkEmailDescription:
		'We sent a link to {email}. Follow it to continue. If the email is not there, check the Spam folder',
}

const ru = {
	back: 'Назад',
	cancel: 'Отменить',
	save: 'Сохранить',
	loading: 'Загрузка...',
	loadMore: 'Показать ещё',
	empty: 'Здесь пока пусто',
	notImplemented: 'Эта функция скоро появится',
	unknownError: 'Что-то пошло не так. Попробуйте ещё раз',
	forbidden: 'Недостаточно прав',
	invalidData: 'Проверьте поля формы',
	tooManyRequests: 'Слишком много попыток. Подождите минуту и попробуйте снова',
	invalidCredentials: 'Неверная почта или пароль',
	emailNotVerified: 'Сначала подтвердите почту — мы отправили вам ссылку',
	innTaken: 'Организация с таким ИНН уже зарегистрирована. Обратитесь к администратору',
	invalidToken: 'Ссылка недействительна или устарела. Запросите новую',
	noSlots: 'Все места на эту задачу уже заняты',
	checkEmailTitle: 'Проверьте почту',
	checkEmailDescription:
		'Мы отправили ссылку на {email}. Перейдите по ней, чтобы продолжить. Если письма нет — загляните в «Спам»',
}

const common = defineTranslations({ en, ru })

export type CommonKey = keyof typeof ru

export default common
