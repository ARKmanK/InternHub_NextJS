import { defineTranslations } from '@/shared/i18n'

const en = {
	studentTitle: 'My tasks',
	favorite: 'Favorites',
	started: 'In progress',
	approved: 'Accepted',
	employerTitle: 'My tasks',
	createTask: 'Post a task',
	edit: 'Edit',
	adminTitle: 'Administrator panel',
	moderation: 'Tasks awaiting moderation',
	empty: 'The list is empty',
}

const ru = {
	studentTitle: 'Мои задачи',
	favorite: 'Избранное',
	started: 'В работе',
	approved: 'Принятые',
	employerTitle: 'Мои задачи',
	createTask: 'Разместить задачу',
	edit: 'Редактировать',
	adminTitle: 'Панель администратора',
	moderation: 'Задачи на модерации',
	empty: 'Список пуст',
}

export default defineTranslations({ en, ru })
