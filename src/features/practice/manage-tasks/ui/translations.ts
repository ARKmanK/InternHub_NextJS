import { defineTranslations } from '@/shared/i18n'

const en = {
	choose: 'Choose a published task',
	add: 'Add',
	remove: 'Remove “{title}” from the practice',
	noOptions: 'All published tasks are already in this practice',
}

const ru = {
	choose: 'Выберите опубликованное задание',
	add: 'Добавить',
	remove: 'Убрать «{title}» из практики',
	noOptions: 'Все опубликованные задания уже в этой практике',
}

export default defineTranslations({ en, ru })
