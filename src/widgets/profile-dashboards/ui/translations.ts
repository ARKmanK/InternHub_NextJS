import { defineTranslations } from '@/shared/i18n'

const en = {
	studentTitle: 'My tasks',
	myPortfolio: 'My portfolio',
	favorite: 'Favorites',
	started: 'In progress',
	approved: 'Accepted',
	employerTitle: 'My tasks',
	createTask: 'Post a task',
	edit: 'Edit',
	adminTitle: 'Administrator panel',
	moderation: 'Tasks awaiting moderation',
	organizationsReview: 'Organizations awaiting verification',
	orgPendingTitle: 'Organization is being verified',
	orgPendingDescription:
		'The administrator will check the INN and contact you. After that you can publish tasks.',
	orgRejectedTitle: 'Organization is not verified',
	orgRejectedDescription:
		'You cannot publish tasks. Contact the platform administrator to find out why.',
	empty: 'The list is empty',
	teachers: 'Teachers',
	teacherActive: 'Active',
	teacherInvited: 'Invited',
	teacherTitle: 'My practices',
	createPractice: 'Create practice',
	noPractices: 'No practices yet',
	myPractices: 'My practices',
	notStarted: 'Not started',
}

const ru = {
	studentTitle: 'Мои задачи',
	myPortfolio: 'Моё портфолио',
	favorite: 'Избранное',
	started: 'В работе',
	approved: 'Принятые',
	employerTitle: 'Мои задачи',
	createTask: 'Разместить задачу',
	edit: 'Редактировать',
	adminTitle: 'Панель администратора',
	moderation: 'Задачи на модерации',
	organizationsReview: 'Организации на проверке',
	orgPendingTitle: 'Организация на проверке',
	orgPendingDescription:
		'Администратор сверит ИНН и при необходимости свяжется с вами. После этого можно будет публиковать задания.',
	orgRejectedTitle: 'Организация не подтверждена',
	orgRejectedDescription:
		'Публиковать задания нельзя. Свяжитесь с администратором платформы, чтобы узнать причину.',
	empty: 'Список пуст',
	teachers: 'Преподаватели',
	teacherActive: 'Активен',
	teacherInvited: 'Приглашён',
	teacherTitle: 'Мои практики',
	createPractice: 'Создать практику',
	noPractices: 'Практик пока нет',
	myPractices: 'Мои практики',
	notStarted: 'Не начато',
}

export default defineTranslations({ en, ru })
