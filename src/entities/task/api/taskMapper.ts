import type { Prisma } from '@/shared/api'
import { IpTerms, TaskDifficulty, TaskStatus } from '@/shared/api'
import type { ITask } from '../model/ITask'

/**
 * Какие поля читать из БД для карточки задания. Один select на все запросы —
 * так DTO везде одинаковый, а Prisma выводит точный тип строки (TaskRow).
 */
export const taskSelect = (viewerId?: string) =>
	({
		id: true,
		title: true,
		description: true,
		expectedResult: true,
		criteria: true,
		difficulty: true,
		status: true,
		ipTerms: true,
		requireRepository: true,
		maxParticipants: true,
		deadline: true,
		archiveKey: true,
		authorId: true,
		organizationId: true,
		createdAt: true,
		publishedAt: true,
		organization: { select: { name: true } },
		tags: { select: { name: true }, orderBy: { name: 'asc' } },
		_count: { select: { favorites: true } },
		// Избранное только текущего зрителя: 0 или 1 запись
		favorites: viewerId ? { where: { studentId: viewerId }, select: { taskId: true } } : false,
	}) satisfies Prisma.TaskSelect

type TaskRow = Prisma.TaskGetPayload<{ select: ReturnType<typeof taskSelect> }>

const difficultyToDto = {
	[TaskDifficulty.EASY]: 1,
	[TaskDifficulty.MEDIUM]: 2,
	[TaskDifficulty.HARD]: 3,
} as const satisfies Record<TaskDifficulty, ITask['difficulty']>

export const difficultyFromDto = {
	1: TaskDifficulty.EASY,
	2: TaskDifficulty.MEDIUM,
	3: TaskDifficulty.HARD,
} as const satisfies Record<ITask['difficulty'], TaskDifficulty>

const statusToDto = {
	[TaskStatus.DRAFT]: 'draft',
	[TaskStatus.MODERATION]: 'moderation',
	[TaskStatus.PUBLISHED]: 'published',
	[TaskStatus.CLOSED]: 'closed',
	[TaskStatus.ARCHIVED]: 'archived',
} as const satisfies Record<TaskStatus, ITask['status']>

const ipTermsToDto = {
	[IpTerms.OPEN]: 'open',
	[IpTerms.PORTFOLIO_ONLY]: 'portfolio_only',
	[IpTerms.NDA]: 'nda',
} as const satisfies Record<IpTerms, ITask['ipTerms']>

/** Строка БД → DTO для интерфейса. Даты превращаются в ISO-строки: так их можно передать в клиентский компонент. */
export const toTaskDto = (row: TaskRow): ITask => ({
	id: row.id,
	title: row.title,
	description: row.description,
	expectedResult: row.expectedResult,
	criteria: row.criteria,
	difficulty: difficultyToDto[row.difficulty],
	status: statusToDto[row.status],
	ipTerms: ipTermsToDto[row.ipTerms],
	requireRepository: row.requireRepository,
	maxParticipants: row.maxParticipants,
	deadline: row.deadline?.toISOString() ?? null,
	authorId: row.authorId,
	organizationId: row.organizationId,
	companyName: row.organization.name,
	trackingCount: row._count.favorites,
	tags: row.tags.map(tag => tag.name),
	hasArchive: row.archiveKey !== null,
	createdAt: row.createdAt.toISOString(),
	publishedAt: row.publishedAt?.toISOString() ?? null,
	isFavorite: (row.favorites?.length ?? 0) > 0,
})
