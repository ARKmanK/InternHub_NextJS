import { timingSafeEqual } from 'node:crypto'
import { sendWeeklyReports } from '@/features/weekly-report/index.server'

/**
 * Еженедельные отчёты работодателям. Вызывается планировщиком (cron на сервере), а не пользователем:
 *   curl -X POST -H "Authorization: Bearer $CRON_SECRET" https://<домен>/api/cron/weekly-reports
 * Без правильного секрета — 401, чтобы никто посторонний не мог запустить рассылку.
 */
export async function POST(request: Request) {
	if (!isAuthorized(request.headers.get('authorization'))) {
		return new Response('Unauthorized', { status: 401 })
	}

	return Response.json(await sendWeeklyReports())
}

// Сравнение за постоянное время: по скорости ответа нельзя подобрать секрет посимвольно
const isAuthorized = (header: string | null) => {
	const secret = process.env.CRON_SECRET
	if (!secret || !header) return false

	const expected = Buffer.from(`Bearer ${secret}`)
	const received = Buffer.from(header)
	return expected.length === received.length && timingSafeEqual(expected, received)
}
