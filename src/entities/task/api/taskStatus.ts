import { TaskStatus, type Prisma } from '@/shared/api'

/**
 * Разрешённые переходы статуса задания — та же диаграмма состояний, что в docs/02-data-model.md.
 * Любой другой переход сервер отклонит, даже если его попытается сделать «свой» код.
 */
const TRANSITIONS: Record<TaskStatus, readonly TaskStatus[]> = {
	[TaskStatus.DRAFT]: [TaskStatus.MODERATION],
	[TaskStatus.MODERATION]: [TaskStatus.PUBLISHED, TaskStatus.DRAFT],
	[TaskStatus.PUBLISHED]: [TaskStatus.MODERATION, TaskStatus.CLOSED, TaskStatus.ARCHIVED],
	[TaskStatus.CLOSED]: [TaskStatus.ARCHIVED],
	[TaskStatus.ARCHIVED]: [],
}

export const canChangeTaskStatus = (from: TaskStatus, to: TaskStatus) =>
	TRANSITIONS[from].includes(to)

type ChangeTaskStatus = {
	taskId: number
	from: TaskStatus
	to: TaskStatus
	changedById: string
	comment?: string | null
	/** Дополнительные поля, которые меняются вместе со статусом (например, publishedAt) */
	data?: Prisma.TaskUpdateManyMutationInput
}

/**
 * Меняет статус и пишет запись в историю. Вызывать внутри транзакции.
 *
 * Условие `status: from` делает операцию атомарной: если статус уже успел измениться
 * (два модератора нажали одновременно), обновится 0 строк и функция вернёт false.
 */
export async function changeTaskStatus(
	tx: Prisma.TransactionClient,
	{ taskId, from, to, changedById, comment, data }: ChangeTaskStatus,
): Promise<boolean> {
	if (!canChangeTaskStatus(from, to)) return false

	const { count } = await tx.task.updateMany({
		where: { id: taskId, status: from },
		data: { ...data, status: to },
	})
	if (count === 0) return false

	await tx.taskStatusChange.create({
		data: { taskId, fromStatus: from, toStatus: to, changedById, comment: comment ?? null },
	})
	return true
}
