import { defineTranslations } from '@/shared/i18n'

const en = {
	open: 'Review',
	title: 'Solution by {name}',
	repository: 'Repository',
	archive: 'Archive',
	download: 'Download',
	studentComment: 'Student comment',
	comment: 'Your comment',
	commentPlaceholder: 'What is good, what should be improved...',
	accept: 'Accept',
	requestChanges: 'Request changes',
	reject: 'Reject',
	done: 'Review saved',
}

const ru = {
	open: 'Проверить',
	title: 'Решение: {name}',
	repository: 'Репозиторий',
	archive: 'Архив',
	download: 'Скачать',
	studentComment: 'Комментарий студента',
	comment: 'Ваш комментарий',
	commentPlaceholder: 'Что получилось хорошо, что стоит доработать...',
	accept: 'Принять',
	requestChanges: 'На доработку',
	reject: 'Отклонить',
	done: 'Проверка сохранена',
}

export default defineTranslations({ en, ru })
