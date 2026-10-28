import { defineTranslations } from '@/shared/i18n'

const en = {
	emptyTitle: 'No tasks found',
	emptyDescription: 'Try changing the filters or come back later',
}

const ru = {
	emptyTitle: 'Задачи не найдены',
	emptyDescription: 'Попробуйте изменить фильтры или загляните позже',
}

export default defineTranslations({ en, ru })
