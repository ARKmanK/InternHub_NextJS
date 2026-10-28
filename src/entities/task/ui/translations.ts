import { defineTranslations } from '@/shared/i18n'

const en = {
	tracking: 'Now tracking',
	isMine: 'My task',
	deadline: 'Deadline',
	unlimited: 'Unlimited',
	difficulty: 'Difficulty',
	taskPage: 'Go to task page',
	statusDraft: 'Draft',
	statusModeration: 'On moderation',
	statusPublished: 'Published',
	statusClosed: 'Closed',
	statusArchived: 'Archived',
}

const ru = {
	tracking: 'Сейчас отслеживают',
	isMine: 'Моя задача',
	deadline: 'Срок до',
	unlimited: 'Неограниченно',
	difficulty: 'Сложность',
	taskPage: 'На страницу задачи',
	statusDraft: 'Черновик',
	statusModeration: 'На модерации',
	statusPublished: 'Опубликована',
	statusClosed: 'Закрыта',
	statusArchived: 'В архиве',
}

export default defineTranslations({ en, ru })
