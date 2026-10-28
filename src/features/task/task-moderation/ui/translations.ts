import { defineTranslations } from '@/shared/i18n'

const en = {
	approve: 'Publish',
	reject: 'Return',
	approved: 'Task published',
	rejected: 'Task returned to the employer',
	rejectTitle: 'Return the task to the author',
	rejectDescription: 'The author will see the reason and will be able to fix the task.',
	reason: 'What should be fixed',
}

const ru = {
	approve: 'Опубликовать',
	reject: 'Вернуть',
	approved: 'Задача опубликована',
	rejected: 'Задача возвращена работодателю',
	rejectTitle: 'Вернуть задачу автору',
	rejectDescription: 'Автор увидит причину и сможет исправить задачу.',
	reason: 'Что нужно исправить',
}

export default defineTranslations({ en, ru })
