import { cache } from 'react'
import { db, SubmissionStatus, TaskStatus, type Prisma } from '@/shared/api'
import type { ITask } from '../model/ITask'
import { TASKS_PAGE_SIZE, type TaskFilters } from '../model/taskFilters'
import { difficultyFromDto, taskSelect, toTaskDto } from './taskMapper'

export type TasksPage = {
	items: ITask[]
	hasMore: boolean
}

export type TaskFilterOptions = {
	companies: { id: number; name: string }[]
	tags: string[]
}

/** Кто смотрит: от этого зависит, какие задания видны и отмечено ли избранное. */
export type TaskViewer = { id: string; role: 'student' | 'employer' | 'admin' } | null

// Студентам видны только опубликованные и закрытые задания
const PUBLIC_STATUSES = [TaskStatus.PUBLISHED, TaskStatus.CLOSED]

const filtersToWhere = (filters: TaskFilters): Prisma.TaskWhereInput => {
	const companyId = filters.company ? Number(filters.company) : undefined

	return {
		status: TaskStatus.PUBLISHED,
		difficulty: filters.difficulty
			? difficultyFromDto[Number(filters.difficulty) as 1 | 2 | 3]
			: undefined,
		organizationId: Number.isInteger(companyId) ? companyId : undefined,
		// Задание должно иметь все выбранные теги
		AND: filters.tags.map(name => ({ tags: { some: { name } } })),
	}
}

/** Лента опубликованных заданий с фильтрами. Берём на одну запись больше, чтобы понять, есть ли следующая страница. */
export async function getTasks(
	filters: TaskFilters,
	offset = 0,
	viewer: TaskViewer = null,
): Promise<TasksPage> {
	const rows = await db.task.findMany({
		where: filtersToWhere(filters),
		select: taskSelect(viewer?.id),
		orderBy: [{ publishedAt: 'desc' }, { id: 'desc' }],
		skip: offset,
		take: TASKS_PAGE_SIZE + 1,
	})

	return {
		items: rows.slice(0, TASKS_PAGE_SIZE).map(toTaskDto),
		hasMore: rows.length > TASKS_PAGE_SIZE,
	}
}

/**
 * Задание по id с учётом прав: опубликованное видят все, черновик и задание на модерации —
 * только автор и администратор. Для остальных — null, как будто задания нет.
 */
export const getTaskById = (id: number, viewer: TaskViewer = null): Promise<ITask | null> =>
	findTaskById(id, viewer?.id ?? null, viewer?.role ?? null)

// cache() из React запоминает результат на время одного запроса к серверу: generateMetadata и страница
// получают задание одним SQL-запросом. Аргументы — примитивы, потому что cache сравнивает их по ссылке.
const findTaskById = cache(
	async (id: number, viewerId: string | null, role: string | null): Promise<ITask | null> => {
		// Администратор видит задания в любом статусе. Важно: не через `{}` внутри OR —
		// Prisma выбрасывает пустое условие из OR, и админ получал бы 404 на задания на модерации
		const visibility: Prisma.TaskWhereInput =
			role === 'admin'
				? {}
				: {
						OR: [
							{ status: { in: PUBLIC_STATUSES } },
							...(role === 'employer' && viewerId ? [{ authorId: viewerId }] : []),
						],
					}

		const row = await db.task.findFirst({
			where: { id, ...visibility },
			select: taskSelect(viewerId ?? undefined),
		})

		return row ? toTaskDto(row) : null
	},
)

export async function getTasksByAuthor(authorId: string): Promise<ITask[]> {
	const rows = await db.task.findMany({
		where: { authorId, status: { not: TaskStatus.ARCHIVED } },
		select: taskSelect(),
		orderBy: { updatedAt: 'desc' },
	})
	return rows.map(toTaskDto)
}

export async function getTasksOnModeration(): Promise<ITask[]> {
	const rows = await db.task.findMany({
		where: { status: TaskStatus.MODERATION },
		select: taskSelect(),
		// Кто дольше ждёт — тот первый
		orderBy: { updatedAt: 'asc' },
	})
	return rows.map(toTaskDto)
}

export async function getFavoriteTasks(studentId: string): Promise<ITask[]> {
	const rows = await db.task.findMany({
		where: { status: { in: PUBLIC_STATUSES }, favorites: { some: { studentId } } },
		select: taskSelect(studentId),
		orderBy: { publishedAt: 'desc' },
	})
	return rows.map(toTaskDto)
}

const getTasksWithStudentSubmission = async (studentId: string, statuses: SubmissionStatus[]) => {
	const rows = await db.task.findMany({
		where: { submissions: { some: { studentId, status: { in: statuses } } } },
		select: taskSelect(studentId),
		orderBy: { updatedAt: 'desc' },
	})
	return rows.map(toTaskDto)
}

/** Вкладка «В работе»: решение начато, отправлено или возвращено на доработку. */
export const getStudentTasksInProgress = (studentId: string): Promise<ITask[]> =>
	getTasksWithStudentSubmission(studentId, [
		SubmissionStatus.DRAFT,
		SubmissionStatus.SUBMITTED,
		SubmissionStatus.CHANGES_REQUESTED,
	])

/** Вкладка «Принятые»: работодатель принял решение — это и есть портфолио студента. */
export const getStudentAcceptedTasks = (studentId: string): Promise<ITask[]> =>
	getTasksWithStudentSubmission(studentId, [SubmissionStatus.ACCEPTED])

/** Варианты для фильтра: только компании и теги, у которых есть опубликованные задания. */
export async function getTaskFilterOptions(): Promise<TaskFilterOptions> {
	const [companies, tags] = await Promise.all([
		db.organization.findMany({
			where: { tasks: { some: { status: TaskStatus.PUBLISHED } } },
			select: { id: true, name: true },
			orderBy: { name: 'asc' },
		}),
		db.tag.findMany({
			where: { tasks: { some: { status: TaskStatus.PUBLISHED } } },
			select: { name: true },
			orderBy: { name: 'asc' },
		}),
	])

	return { companies, tags: tags.map(tag => tag.name) }
}
