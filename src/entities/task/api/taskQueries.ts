import type { ITask } from '../model/ITask'
import type { TaskFilters } from '../model/taskFilters'

export type TasksPage = {
	items: ITask[]
	hasMore: boolean
}

export type TaskFilterOptions = {
	companies: { id: number; name: string }[]
	tags: string[]
}

// Все функции ниже вызываются только на сервере.
// TODO(этап 1): заменить заглушки запросами через Prisma (размер страницы — TASKS_PAGE_SIZE).

export async function getTasks(_filters: TaskFilters, _offset = 0): Promise<TasksPage> {
	return { items: [], hasMore: false }
}

export async function getTaskById(_id: number): Promise<ITask | null> {
	return null
}

export async function getTasksByEmployer(_employerId: number): Promise<ITask[]> {
	return []
}

export async function getTasksOnModeration(): Promise<ITask[]> {
	return []
}

export async function getFavoriteTasks(_studentId: number): Promise<ITask[]> {
	return []
}

export async function getTaskFilterOptions(): Promise<TaskFilterOptions> {
	return { companies: [], tags: [] }
}
