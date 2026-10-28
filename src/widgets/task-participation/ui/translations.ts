import { defineTranslations } from '@/shared/i18n'

const en = {
	closedTitle: 'Applications are closed',
	closedDescription: 'The employer is no longer accepting new participants for this task.',
	pendingTitle: 'Your application is under review',
	pendingDescription: 'You will get a notification when the employer decides.',
	declinedTitle: 'The employer declined your application',
	submittedTitle: 'Your solution is under review',
	submittedDescription: 'The employer will check it and leave feedback.',
	acceptedTitle: 'Solution accepted — score {score} / 5',
	rejectedTitle: 'The solution was rejected',
	changesTitle: 'The solution was sent back for changes',
}

const ru = {
	closedTitle: 'Приём закрыт',
	closedDescription: 'Работодатель больше не принимает новых участников по этой задаче.',
	pendingTitle: 'Заявка на рассмотрении',
	pendingDescription: 'Придёт уведомление, когда работодатель примет решение.',
	declinedTitle: 'Работодатель отклонил заявку',
	submittedTitle: 'Решение на проверке',
	submittedDescription: 'Работодатель проверит его и оставит отзыв.',
	acceptedTitle: 'Решение принято — оценка {score} / 5',
	rejectedTitle: 'Решение отклонено',
	changesTitle: 'Решение возвращено на доработку',
}

export default defineTranslations({ en, ru })
