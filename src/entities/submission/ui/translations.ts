import { defineTranslations } from '@/shared/i18n'

const en = {
	draft: 'Draft',
	submitted: 'On review',
	changes_requested: 'Needs changes',
	accepted: 'Accepted',
	rejected: 'Rejected',
}

const ru = {
	draft: 'Черновик',
	submitted: 'На проверке',
	changes_requested: 'На доработке',
	accepted: 'Принято',
	rejected: 'Отклонено',
}

export default defineTranslations({ en, ru })
