import { defineTranslations } from '@/shared/i18n'

const en = {
	open: 'Grade {name}',
	title: 'Final grade: {name}',
	comment: 'Comment (optional)',
	saved: 'Grade saved',
}

const ru = {
	open: 'Оценить: {name}',
	title: 'Итоговая оценка: {name}',
	comment: 'Комментарий (необязательно)',
	saved: 'Оценка сохранена',
}

export default defineTranslations({ en, ru })
