import { getCurrentUser } from '@/entities/user/index.server'
import { buildPracticeReport } from '@/features/practice/practice-report/index.server'

// Ведомость практики в CSV — только преподаватель, который её ведёт
export async function GET(
	_request: Request,
	{ params }: RouteContext<'/api/practices/[id]/report'>,
) {
	const id = Number((await params).id)
	if (!Number.isInteger(id) || id <= 0) return new Response('Not Found', { status: 404 })

	const report = await buildPracticeReport(id, await getCurrentUser())
	if (!report) return new Response('Not Found', { status: 404 })

	return new Response(report.csv, {
		headers: {
			'Content-Type': 'text/csv; charset=utf-8',
			'Content-Disposition': `attachment; filename="${report.fileName}"`,
			'X-Content-Type-Options': 'nosniff',
			'Cache-Control': 'private, no-store',
		},
	})
}
