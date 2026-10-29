import 'server-only'
import {
	db,
	getEmailTranslator,
	OrganizationStatus,
	sendMail,
	SubmissionStatus,
	UserRole,
} from '@/shared/api'
import { routes } from '@/shared/config'
import { defaultLocale, isLocale } from '@/shared/i18n'

const WEEK_MS = 7 * 24 * 60 * 60 * 1000

export type WeeklyReportResult = { sent: number; skipped: number; failed: number }

/**
 * Еженедельный отчёт работодателям: сколько новых решений пришло по каждому заданию.
 *
 * - Период — с прошлого отчёта (lastReportSentAt), для первого — последние 7 дней.
 *   Поэтому повторный запуск по расписанию не пришлёт то же самое второй раз.
 * - В письмо попадают только задания с новыми решениями; нет решений — нет письма.
 * - Письмо на языке работодателя. Ошибка отправки одному не останавливает остальных.
 */
export async function sendWeeklyReports(now = new Date()): Promise<WeeklyReportResult> {
	const employers = await db.employerProfile.findMany({
		where: {
			organization: { status: OrganizationStatus.VERIFIED },
			user: { role: UserRole.EMPLOYER, emailVerified: true },
		},
		select: {
			userId: true,
			lastReportSentAt: true,
			user: { select: { name: true, email: true, locale: true } },
		},
	})

	const result: WeeklyReportResult = { sent: 0, skipped: 0, failed: 0 }

	for (const employer of employers) {
		const since = employer.lastReportSentAt ?? new Date(now.getTime() - WEEK_MS)

		const counts = await db.submission.groupBy({
			by: ['taskId'],
			where: {
				task: { authorId: employer.userId },
				status: { not: SubmissionStatus.DRAFT },
				submittedAt: { gt: since, lte: now },
			},
			_count: { _all: true },
		})

		if (counts.length > 0) {
			const tasks = await db.task.findMany({
				where: { id: { in: counts.map(row => row.taskId) } },
				select: { id: true, title: true },
			})
			const titles = new Map(tasks.map(task => [task.id, task.title]))
			const locale = isLocale(employer.user.locale) ? employer.user.locale : defaultLocale
			const t = getEmailTranslator(locale)

			const lines = counts.map(row =>
				t('reportLine', { taskTitle: titles.get(row.taskId) ?? '', count: row._count._all }),
			)
			const sinceText = new Intl.DateTimeFormat(locale, { dateStyle: 'long' }).format(since)
			const url = `${process.env.BETTER_AUTH_URL}${routes.profile()}`

			try {
				await sendMail({
					to: employer.user.email,
					subject: t('reportSubject'),
					text: [
						t('greeting', { name: employer.user.name }),
						'',
						t('reportIntro', { since: sinceText }),
						...lines.map(line => `• ${line}`),
						'',
						t('reportOpen', { url }),
					].join('\n'),
				})
				result.sent++
			} catch (error) {
				// Не отмечаем отчёт отправленным — в следующий раз эти решения попадут в письмо
				console.error('sendWeeklyReports', employer.user.email, error)
				result.failed++
				continue
			}
		} else {
			result.skipped++
		}

		await db.employerProfile.update({
			where: { userId: employer.userId },
			data: { lastReportSentAt: now },
		})
	}

	return result
}
