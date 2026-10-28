import { defineTranslations } from '@/shared/i18n'

const en = {
	approve: 'Confirm',
	reject: 'Reject',
	approved: 'Organization confirmed',
	rejected: 'Organization rejected',
}

const ru = {
	approve: 'Подтвердить',
	reject: 'Отклонить',
	approved: 'Организация подтверждена',
	rejected: 'Организация отклонена',
}

export default defineTranslations({ en, ru })
