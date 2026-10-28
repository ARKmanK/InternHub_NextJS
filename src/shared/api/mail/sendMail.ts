import 'server-only'
import nodemailer, { type Transporter } from 'nodemailer'

export type Mail = {
	to: string
	subject: string
	text: string
	html?: string
}

let transporter: Transporter | null | undefined

/** SMTP-транспорт из переменных окружения. null — SMTP не настроен. */
const getTransporter = () => {
	if (transporter !== undefined) return transporter

	const host = process.env.SMTP_HOST
	transporter = host
		? nodemailer.createTransport({
				host,
				port: Number(process.env.SMTP_PORT ?? 465),
				secure: Number(process.env.SMTP_PORT ?? 465) === 465,
				auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD },
			})
		: null
	return transporter
}

/**
 * Отправка письма. Если SMTP не настроен, письмо печатается в консоль сервера —
 * так при разработке можно открыть ссылку подтверждения без настоящей почты.
 * В production без SMTP — ошибка: молча терять письма нельзя.
 */
export async function sendMail(mail: Mail) {
	const smtp = getTransporter()

	if (!smtp) {
		if (process.env.NODE_ENV === 'production') throw new Error('SMTP не настроен (SMTP_HOST)')
		console.info(`\n✉️  Письмо для ${mail.to}\n   Тема: ${mail.subject}\n${mail.text}\n`)
		return
	}

	await smtp.sendMail({ from: process.env.MAIL_FROM, ...mail })
}
