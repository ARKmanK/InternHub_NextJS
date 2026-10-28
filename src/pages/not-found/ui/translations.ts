import { defineTranslations } from '@/shared/i18n'

const en = {
	title: 'Page not found',
	description: 'The page may have been deleted or the link is incorrect',
	home: 'To the task list',
}

const ru = {
	title: 'Страница не найдена',
	description: 'Возможно, её удалили или в ссылке ошибка',
	home: 'К списку задач',
}

export default defineTranslations({ en, ru })
