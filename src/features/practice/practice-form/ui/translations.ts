import { defineTranslations } from '@/shared/i18n'

const en = {
	createTitle: 'New practice',
	editTitle: 'Edit practice',
	title: 'Title',
	titlePlaceholder: 'Internship, group PMI-22, autumn 2026',
	description: 'Description',
	descriptionPlaceholder: 'Goals, requirements for the report, how the grade is formed...',
	startsAt: 'Start date',
	endsAt: 'End date',
	create: 'Create practice',
	save: 'Save',
}

const ru = {
	createTitle: 'Новая практика',
	editTitle: 'Редактирование практики',
	title: 'Название',
	titlePlaceholder: 'Учебная практика, группа ПМИ-22, осень 2026',
	description: 'Описание',
	descriptionPlaceholder: 'Цели, требования к отчёту, из чего складывается оценка...',
	startsAt: 'Дата начала',
	endsAt: 'Дата окончания',
	create: 'Создать практику',
	save: 'Сохранить',
}

export default defineTranslations({ en, ru })
