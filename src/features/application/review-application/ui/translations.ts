import { defineTranslations } from '@/shared/i18n'

const en = {
	accept: 'Accept',
	decline: 'Decline',
	accepted: 'Application accepted',
	declined: 'Application declined',
}

const ru = {
	accept: 'Принять',
	decline: 'Отклонить',
	accepted: 'Заявка принята',
	declined: 'Заявка отклонена',
}

export default defineTranslations({ en, ru })
