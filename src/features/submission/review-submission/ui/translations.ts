import { defineTranslations } from '@/shared/i18n'

const en = {
	open: 'Review',
	view: 'Open',
	title: 'Solution by {name}',
	repository: 'Repository',
	files: 'Files',
	studentComment: 'Student comment',
	score: 'Score',
	scoreHint: 'Required to accept the solution',
	reviewComment: 'Review',
	comment: 'Your comment',
	commentPlaceholder: 'What is good, what should be improved...',
	commentHint: 'Required to send back for changes or reject',
	accept: 'Accept',
	requestChanges: 'Request changes',
	reject: 'Reject',
	done: 'Review saved',
}

const ru = {
	open: 'Проверить',
	view: 'Открыть',
	title: 'Решение: {name}',
	repository: 'Репозиторий',
	files: 'Файлы',
	studentComment: 'Комментарий студента',
	score: 'Оценка',
	scoreHint: 'Нужна, чтобы принять решение',
	reviewComment: 'Отзыв',
	comment: 'Ваш комментарий',
	commentPlaceholder: 'Что получилось хорошо, что стоит доработать...',
	commentHint: 'Обязателен, чтобы вернуть на доработку или отклонить',
	accept: 'Принять',
	requestChanges: 'На доработку',
	reject: 'Отклонить',
	done: 'Проверка сохранена',
}

export default defineTranslations({ en, ru })
