import { defineTranslations } from '@/shared/i18n'

const en = {
	approve: 'Publish',
	reject: 'Return',
	approved: 'Task published',
	rejected: 'Task returned to the employer',
}

const ru = {
	approve: 'Опубликовать',
	reject: 'Вернуть',
	approved: 'Задача опубликована',
	rejected: 'Задача возвращена работодателю',
}

export default defineTranslations({ en, ru })
