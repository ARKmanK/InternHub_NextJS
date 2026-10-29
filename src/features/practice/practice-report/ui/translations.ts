import { defineTranslations } from '@/shared/i18n'

const en = {
	download: 'Report (CSV)',
	student: 'Student',
	group: 'Group',
	course: 'Year',
	grade: 'Final grade',
	comment: 'Comment',
	notStarted: 'Not started',
}

const ru = {
	download: 'Ведомость (CSV)',
	student: 'Студент',
	group: 'Группа',
	course: 'Курс',
	grade: 'Итоговая оценка',
	comment: 'Комментарий',
	notStarted: 'Не начато',
}

export default defineTranslations({ en, ru })
