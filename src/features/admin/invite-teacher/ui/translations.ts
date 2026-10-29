import { defineTranslations } from '@/shared/i18n'

const en = {
	name: 'Teacher name',
	email: 'Email',
	invite: 'Invite',
	sent: 'Invitation sent to {email}',
}

const ru = {
	name: 'Имя преподавателя',
	email: 'Почта',
	invite: 'Пригласить',
	sent: 'Приглашение отправлено на {email}',
}

export default defineTranslations({ en, ru })
