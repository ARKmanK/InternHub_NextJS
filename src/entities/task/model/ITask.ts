/**
 * Жизненный цикл задания (docs/02-data-model.md, диаграмма состояний):
 * draft → moderation → published → closed → archived; модератор может вернуть moderation → draft.
 *
 * Это DTO для интерфейса, а не строка из БД: значения enum'ов Prisma (DRAFT, EASY, ...)
 * переводятся в эти типы в entities/task/api/taskMapper.ts. Так UI не зависит от схемы базы.
 */
export const TASK_STATUSES = ['draft', 'moderation', 'published', 'closed', 'archived'] as const

export type TaskStatus = (typeof TASK_STATUSES)[number]

export const TASK_DIFFICULTIES = [1, 2, 3] as const

export type TaskDifficulty = (typeof TASK_DIFFICULTIES)[number]

export const IP_TERMS = ['open', 'portfolio_only', 'nda'] as const

export type IpTerms = (typeof IP_TERMS)[number]

export interface ITask {
	id: number
	title: string
	description: string
	expectedResult: string | null
	criteria: string | null
	difficulty: TaskDifficulty
	status: TaskStatus
	ipTerms: IpTerms
	requireRepository: boolean
	maxParticipants: number | null
	deadline: string | null
	authorId: string
	organizationId: number
	companyName: string
	trackingCount: number
	tags: string[]
	hasArchive: boolean
	createdAt: string
	publishedAt: string | null
	/** Зависит от того, кто смотрит: true, если задача в избранном у текущего студента. */
	isFavorite: boolean
}
