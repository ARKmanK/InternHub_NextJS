import type { Locale } from '@/shared/i18n'
import { getEmailTranslator } from '../mail/emailTranslations'
import type { Mail } from '../mail'

// Имя вводит пользователь — в HTML его нужно экранировать
const escapeHtml = (value: string) =>
	value.replace(
		/[&<>"']/g,
		char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]!,
	)

type LinkEmail = { to: string; name: string; url: string; locale: Locale }

/** Письмо со ссылкой-кнопкой: подтверждение почты и сброс пароля устроены одинаково. */
const linkEmail = (
	{ to, name, url, locale }: LinkEmail,
	keys: {
		subject: 'verifySubject' | 'resetSubject'
		text: 'verifyText' | 'resetText'
		button: 'verifyButton' | 'resetButton'
	},
): Mail => {
	const t = getEmailTranslator(locale)
	const greeting = t('greeting', { name })
	return {
		to,
		subject: t(keys.subject),
		text: `${greeting}\n\n${t(keys.text)}\n${url}\n\n${t('linkExpires')} ${t('ignore')}`,
		html: `<p>${escapeHtml(greeting)}</p><p>${t(keys.text)}</p><p><a href="${url}">${t(keys.button)}</a></p><p>${t('linkExpires')} ${t('ignore')}</p>`,
	}
}

export const verificationEmail = (data: LinkEmail) =>
	linkEmail(data, { subject: 'verifySubject', text: 'verifyText', button: 'verifyButton' })

export const resetPasswordEmail = (data: LinkEmail) =>
	linkEmail(data, { subject: 'resetSubject', text: 'resetText', button: 'resetButton' })

export const existingAccountEmail = ({ to, name, url, locale }: LinkEmail): Mail => {
	const t = getEmailTranslator(locale)
	return {
		to,
		subject: t('existingSubject'),
		text: `${t('greeting', { name })}\n\n${t('existingText')}\n${url}\n\n${t('existingSafe')}`,
	}
}
