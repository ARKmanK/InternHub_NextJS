import { defineTranslations } from '@/shared/i18n'

const en = {
	pending: 'Under review',
	accepted: 'Accepted',
	declined: 'Declined',
	withdrawn: 'Withdrawn',
}

const ru = {
	pending: 'На рассмотрении',
	accepted: 'Принята',
	declined: 'Отклонена',
	withdrawn: 'Отозвана',
}

export default defineTranslations({ en, ru })
