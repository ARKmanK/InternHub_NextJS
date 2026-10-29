import { db, IpTerms, SubmissionStatus } from '@/shared/api'
import type { IPortfolioItem } from '../model/IPortfolioItem'

const ipTermsToDto = {
	[IpTerms.OPEN]: 'open',
	[IpTerms.PORTFOLIO_ONLY]: 'portfolio_only',
	[IpTerms.NDA]: 'nda',
} as const satisfies Record<IpTerms, IPortfolioItem['ipTerms']>

/**
 * Портфолио студента — принятые решения, новые сверху. Вызывается только на сервере.
 * Ссылка на репозиторий отдаётся только по заданиям, где работодатель разрешил публикацию:
 * условия интеллектуальной собственности соблюдаются уже на уровне данных, а не только в интерфейсе.
 */
export async function getPortfolio(studentId: string): Promise<IPortfolioItem[]> {
	const rows = await db.submission.findMany({
		where: { studentId, status: SubmissionStatus.ACCEPTED },
		select: {
			id: true,
			score: true,
			reviewComment: true,
			reviewedAt: true,
			repositoryUrl: true,
			task: {
				select: {
					id: true,
					title: true,
					ipTerms: true,
					organization: { select: { name: true } },
					tags: { select: { name: true }, orderBy: { name: 'asc' } },
				},
			},
		},
		orderBy: { reviewedAt: 'desc' },
	})

	return rows.map(row => ({
		submissionId: row.id,
		taskId: row.task.id,
		taskTitle: row.task.title,
		companyName: row.task.organization.name,
		tags: row.task.tags.map(tag => tag.name),
		score: row.score,
		reviewComment: row.task.ipTerms === IpTerms.NDA ? null : row.reviewComment,
		acceptedAt: row.reviewedAt?.toISOString() ?? null,
		ipTerms: ipTermsToDto[row.task.ipTerms],
		repositoryUrl: row.task.ipTerms === IpTerms.OPEN ? row.repositoryUrl : null,
	}))
}
