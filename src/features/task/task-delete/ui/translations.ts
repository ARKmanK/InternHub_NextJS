import { defineTranslations } from '@/shared/i18n'

const en = {
	deleteTask: 'Delete task',
	title: 'Delete the task?',
	description: 'This action cannot be undone. Type «{phrase}» to confirm deletion.',
	cancel: 'Cancel',
	delete: 'Delete',
	deleted: 'Task deleted',
}

const ru = {
	deleteTask: 'Удалить задачу',
	title: 'Удалить задачу?',
	description: 'Удаление нельзя будет отменить. Чтобы подтвердить, введите «{phrase}».',
	cancel: 'Отменить',
	delete: 'Удалить',
	deleted: 'Задача удалена',
}

export default defineTranslations({ en, ru })
