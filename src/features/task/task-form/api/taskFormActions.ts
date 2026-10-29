'use server'

import { revalidatePath } from 'next/cache'
import { db, IpTerms, saveUpload, storage, TaskStatus, type Prisma } from '@/shared/api'
import { routes } from '@/shared/config'
import type { ActionResult } from '@/shared/lib/actionResult'
import { taskFormSchema, type TaskFormValues } from '@/entities/task'
import { changeTaskStatus, difficultyFromDto } from '@/entities/task/index.server'
import { notifyAdmins } from '@/entities/notification/index.server'
import { getCurrentUser } from '@/entities/user/index.server'
import { formDataToTaskForm } from '../lib/toFormData'

const ipTermsFromDto = {
	open: IpTerms.OPEN,
	portfolio_only: IpTerms.PORTFOLIO_ONLY,
	nda: IpTerms.NDA,
} as const

/** Значения формы → поля задания в БД (кроме статуса, автора и архива). */
const toTaskData = (values: TaskFormValues) => ({
	title: values.title,
	description: values.description,
	expectedResult: values.expectedResult || null,
	criteria: values.criteria || null,
	difficulty: difficultyFromDto[Number(values.difficulty) as 1 | 2 | 3],
	ipTerms: ipTermsFromDto[values.ipTerms],
	requireRepository: values.requireRepository,
	maxParticipants: values.maxParticipants ? Number(values.maxParticipants) : null,
	deadline: values.deadline,
})

/** Теги по названию: существующие подключаются, новых создаётся запись в справочнике. */
const connectTags = (tags: string[]): Prisma.TagCreateNestedManyWithoutTasksInput => ({
	connectOrCreate: [...new Set(tags)].map(name => ({ where: { name }, create: { name } })),
})

/** Компетенции только из справочника: несуществующие id молча отбрасываются. */
const existingCompetencies = async (ids: number[]) => {
	const rows = await db.competency.findMany({
		where: { id: { in: [...new Set(ids)] } },
		select: { id: true },
	})
	return rows
}

/** Кто может публиковать: работодатель подтверждённой организации. */
const getPublisher = async () => {
	const user = await getCurrentUser()
	if (user?.role !== 'employer' || user.organization?.status !== 'verified') return null
	return { id: user.id, organizationId: user.organization.id }
}

const parseForm = (formData: FormData) => {
	const parsed = taskFormSchema.safeParse(formDataToTaskForm(formData))
	if (!parsed.success) return null
	// Срок не может быть в прошлом (сравниваем по дате, без времени)
	const { deadline } = parsed.data
	if (deadline && deadline < new Date(new Date().toDateString())) return null
	return parsed.data
}

/** Новое задание сразу уходит на модерацию: черновик без отправки пока не нужен. */
export async function createTaskAction(formData: FormData): Promise<ActionResult<{ id: number }>> {
	const publisher = await getPublisher()
	if (!publisher) return { ok: false, error: 'forbidden' }

	const values = parseForm(formData)
	if (!values) return { ok: false, error: 'invalidData' }

	const competencies = await existingCompetencies(values.competencies)
	const archiveKey = values.archive ? await saveUpload(values.archive, 'tasks') : null

	try {
		const task = await db.$transaction(async tx => {
			const created = await tx.task.create({
				data: {
					...toTaskData(values),
					status: TaskStatus.MODERATION,
					archiveKey,
					authorId: publisher.id,
					organizationId: publisher.organizationId,
					tags: connectTags(values.tags),
					competencies: { connect: competencies },
				},
				select: { id: true, title: true },
			})
			await tx.taskStatusChange.create({
				data: { taskId: created.id, toStatus: TaskStatus.MODERATION, changedById: publisher.id },
			})
			await notifyAdmins(
				{
					type: 'TASK_ON_MODERATION',
					params: { taskTitle: created.title },
					link: routes.task(created.id),
				},
				tx,
			)
			return created
		})

		revalidatePath(routes.profile())
		return { ok: true, data: { id: task.id } }
	} catch (error) {
		// Задание не создалось — файл больше никому не нужен
		if (archiveKey) await storage.delete(archiveKey)
		console.error('createTaskAction', error)
		return { ok: false, error: 'unknownError' }
	}
}

// Редактировать можно, пока задание не закрыто
const EDITABLE: TaskStatus[] = [TaskStatus.DRAFT, TaskStatus.MODERATION, TaskStatus.PUBLISHED]

/**
 * Изменения в опубликованном задании снова проходят модерацию — иначе после одобрения
 * в задание можно было бы вписать что угодно.
 */
export async function updateTaskAction(
	taskId: number,
	formData: FormData,
): Promise<ActionResult<{ id: number }>> {
	const publisher = await getPublisher()
	if (!publisher) return { ok: false, error: 'forbidden' }
	if (!Number.isInteger(taskId)) return { ok: false, error: 'invalidData' }

	const task = await db.task.findUnique({
		where: { id: taskId },
		select: { authorId: true, status: true, archiveKey: true },
	})
	// Чужое задание и несуществующее отвечают одинаково
	if (!task || task.authorId !== publisher.id) return { ok: false, error: 'forbidden' }
	if (!EDITABLE.includes(task.status)) return { ok: false, error: 'forbidden' }

	const values = parseForm(formData)
	if (!values) return { ok: false, error: 'invalidData' }

	const competencies = await existingCompetencies(values.competencies)
	const newArchiveKey = values.archive ? await saveUpload(values.archive, 'tasks') : null

	try {
		await db.$transaction(async tx => {
			await tx.task.update({
				where: { id: taskId },
				data: {
					...toTaskData(values),
					...(newArchiveKey && { archiveKey: newArchiveKey }),
					// set: [] — сначала отвязать все теги, затем подключить актуальные
					tags: { set: [], ...connectTags(values.tags) },
					competencies: { set: competencies },
				},
			})
			if (task.status !== TaskStatus.MODERATION) {
				const to = TaskStatus.MODERATION
				const changed = await changeTaskStatus(tx, {
					taskId,
					from: task.status,
					to,
					changedById: publisher.id,
					comment: 'Изменено автором',
				})
				if (!changed) throw new Error('Статус задания изменился во время редактирования')
				await notifyAdmins(
					{
						type: 'TASK_EDITED',
						params: { taskTitle: values.title },
						link: routes.task(taskId),
					},
					tx,
				)
			}
		})
	} catch (error) {
		if (newArchiveKey) await storage.delete(newArchiveKey)
		console.error('updateTaskAction', error)
		return { ok: false, error: 'unknownError' }
	}

	// Старый архив удаляем только после успешного сохранения
	if (newArchiveKey && task.archiveKey) await storage.delete(task.archiveKey)

	revalidatePath(routes.task(taskId))
	revalidatePath(routes.profile())
	return { ok: true, data: { id: taskId } }
}
