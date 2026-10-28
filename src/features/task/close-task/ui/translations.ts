import { defineTranslations } from '@/shared/i18n'

const en = {
	close: 'Close',
	title: 'Close the task?',
	description:
		'New applications and solutions will no longer be accepted. Solutions sent back for changes can still be finished.',
	closed: 'Task closed',
}

const ru = {
	close: 'Закрыть приём',
	title: 'Закрыть приём решений?',
	description:
		'Новые заявки и решения больше не будут приниматься. Решения, отправленные на доработку, студенты смогут доделать.',
	closed: 'Приём решений закрыт',
}

export default defineTranslations({ en, ru })
