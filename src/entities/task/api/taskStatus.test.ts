import { describe, expect, it, vi } from 'vitest'
import { TaskStatus, type Prisma } from '@/shared/api'
import { canChangeTaskStatus, changeTaskStatus } from './taskStatus'

describe('canChangeTaskStatus', () => {
	it.each([
		[TaskStatus.DRAFT, TaskStatus.MODERATION],
		[TaskStatus.MODERATION, TaskStatus.PUBLISHED],
		[TaskStatus.MODERATION, TaskStatus.DRAFT],
		[TaskStatus.PUBLISHED, TaskStatus.CLOSED],
		[TaskStatus.CLOSED, TaskStatus.ARCHIVED],
	])('%s → %s разрешён', (from, to) => {
		expect(canChangeTaskStatus(from, to)).toBe(true)
	})

	it.each([
		[TaskStatus.DRAFT, TaskStatus.PUBLISHED],
		[TaskStatus.CLOSED, TaskStatus.PUBLISHED],
		[TaskStatus.ARCHIVED, TaskStatus.DRAFT],
		[TaskStatus.PUBLISHED, TaskStatus.PUBLISHED],
	])('%s → %s запрещён', (from, to) => {
		expect(canChangeTaskStatus(from, to)).toBe(false)
	})
})

/** Подставной клиент транзакции: updateMany вернёт заданное число строк. */
const fakeTx = (count: number) => {
	const tx = {
		task: { updateMany: vi.fn().mockResolvedValue({ count }) },
		taskStatusChange: { create: vi.fn().mockResolvedValue({}) },
	}
	return tx as typeof tx & Prisma.TransactionClient
}

describe('changeTaskStatus', () => {
	const input = {
		taskId: 7,
		from: TaskStatus.MODERATION,
		to: TaskStatus.PUBLISHED,
		changedById: 'admin',
	}

	it('меняет статус с условием на прежний и пишет историю', async () => {
		const tx = fakeTx(1)
		await expect(changeTaskStatus(tx, input)).resolves.toBe(true)
		expect(tx.task.updateMany).toHaveBeenCalledWith({
			where: { id: 7, status: TaskStatus.MODERATION },
			data: { status: TaskStatus.PUBLISHED },
		})
		expect(tx.taskStatusChange.create).toHaveBeenCalledOnce()
	})

	it('статус уже изменился (гонка) — без записи в историю', async () => {
		const tx = fakeTx(0)
		await expect(changeTaskStatus(tx, input)).resolves.toBe(false)
		expect(tx.taskStatusChange.create).not.toHaveBeenCalled()
	})

	it('запрещённый переход не доходит до базы', async () => {
		const tx = fakeTx(1)
		await expect(
			changeTaskStatus(tx, { ...input, from: TaskStatus.ARCHIVED, to: TaskStatus.DRAFT }),
		).resolves.toBe(false)
		expect(tx.task.updateMany).not.toHaveBeenCalled()
	})
})
