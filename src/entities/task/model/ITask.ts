/**
 * Жизненный цикл задания (этап 1, диаграмма состояний):
 * draft → moderation → published → closed → archived; модератор может вернуть moderation → draft.
 * TODO(этап 1): типы будут генерироваться из schema.prisma.
 */
export const TASK_STATUSES = ['draft', 'moderation', 'published', 'closed', 'archived'] as const

export type TaskStatus = (typeof TASK_STATUSES)[number]

export const TASK_DIFFICULTIES = [1, 2, 3] as const

export type TaskDifficulty = (typeof TASK_DIFFICULTIES)[number]

export interface ITask {
	id: number
	title: string
	description: string
	difficulty: TaskDifficulty
	status: TaskStatus
	deadline: string | null
	employerId: number
	companyName: string
	trackingCount: number
	tags: string[]
	archiveUrl: string | null
	createdAt: string
	/** Зависит от того, кто смотрит: true, если задача в избранном у текущего студента. */
	isFavorite: boolean
}
