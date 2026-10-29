/** Принятое решение в портфолио студента. */
export interface IPortfolioItem {
	submissionId: number
	taskId: number
	taskTitle: string
	companyName: string
	tags: string[]
	score: number | null
	reviewComment: string | null
	acceptedAt: string | null
	/** Условия задания: для NDA показываем только факт выполнения */
	ipTerms: 'open' | 'portfolio_only' | 'nda'
	/** Только для заданий с условием «можно публиковать», иначе null */
	repositoryUrl: string | null
}
