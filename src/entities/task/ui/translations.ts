import { defineTranslations } from '@/shared/i18n'

const en = {
	competencies: 'Competencies',
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
	expectedResult: 'Expected result',
	criteria: 'Evaluation criteria',
	ipTerms: 'Result usage',
	ipOpen: 'Can be published (GitHub, portfolio)',
	ipPortfolioOnly: 'Portfolio on the platform only',
	ipNda: 'Confidential (NDA)',
	maxParticipants: 'Max participants',
}

const ru = {
	competencies: 'Компетенции',
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
	expectedResult: 'Ожидаемый результат',
	criteria: 'Критерии оценки',
	ipTerms: 'Использование результата',
	ipOpen: 'Можно публиковать (GitHub, портфолио)',
	ipPortfolioOnly: 'Только портфолио на платформе',
	ipNda: 'Конфиденциально (NDA)',
	maxParticipants: 'Максимум участников',
}

export default defineTranslations({ en, ru })
