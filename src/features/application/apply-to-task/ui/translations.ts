import { defineTranslations } from '@/shared/i18n'

const en = {
	apply: 'Take the task',
	title: 'Application for the task',
	description:
		'The employer will review the application. After it is accepted you can submit a solution.',
	message: 'Message to the employer (optional)',
	messagePlaceholder: 'Why you want to take this task, relevant experience...',
	send: 'Send application',
	sent: 'Application sent',
}

const ru = {
	apply: 'Взяться за задачу',
	title: 'Заявка на выполнение',
	description: 'Работодатель рассмотрит заявку. После одобрения вы сможете сдать решение.',
	message: 'Сообщение работодателю (необязательно)',
	messagePlaceholder: 'Почему вам интересна задача, похожий опыт...',
	send: 'Отправить заявку',
	sent: 'Заявка отправлена',
}

export default defineTranslations({ en, ru })
