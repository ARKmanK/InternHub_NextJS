import { defineTranslations } from '@/shared/i18n'

const en = {
	title: 'Submit a solution',
	resubmitTitle: 'Send the revised solution',
	description: 'The employer will review it and leave feedback.',
	repository: 'Repository link',
	repositoryOptional: 'Repository link (optional)',
	comment: 'Comment',
	commentPlaceholder: 'What was done, how to run it, what to pay attention to...',
	archive: 'Archive',
	archiveTitle: 'Archive with the solution',
	archiveDescription: 'zip, rar, 7z, tar, gz — up to 50 MB',
	images: 'Screenshots',
	imagesHint: 'png, jpg, webp — up to {max} files, 10 MB each',
	chooseFile: 'Choose file',
	removeFile: 'Remove file',
	submit: 'Send for review',
	sending: 'Sending...',
	sent: 'Solution sent for review',
}

const ru = {
	title: 'Сдать решение',
	resubmitTitle: 'Отправить доработанное решение',
	description: 'Работодатель проверит его и оставит отзыв.',
	repository: 'Ссылка на репозиторий',
	repositoryOptional: 'Ссылка на репозиторий (необязательно)',
	comment: 'Комментарий',
	commentPlaceholder: 'Что сделано, как запустить, на что обратить внимание...',
	archive: 'Архив',
	archiveTitle: 'Архив с решением',
	archiveDescription: 'zip, rar, 7z, tar, gz — до 50 МБ',
	images: 'Скриншоты',
	imagesHint: 'png, jpg, webp — до {max} файлов, до 10 МБ каждый',
	chooseFile: 'Выбрать файл',
	removeFile: 'Удалить файл',
	submit: 'Отправить на проверку',
	sending: 'Отправка...',
	sent: 'Решение отправлено на проверку',
}

export default defineTranslations({ en, ru })
