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
}

const common = defineTranslations({ en, ru })

export type CommonKey = keyof typeof ru

export default common
