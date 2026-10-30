'use server'

import { revalidatePath } from 'next/cache'
import {
	ApplicationStatus,
	db,
	saveUpload,
	storage,
	SubmissionFileKind,
	SubmissionStatus,
	TaskStatus,
	transaction,
} from '@/shared/api'
import { routes } from '@/shared/config'
import type { ActionResult } from '@/shared/lib/actionResult'
import { notifyUsers } from '@/entities/notification/index.server'
import { changeSubmissionStatus } from '@/entities/submission/index.server'
import { getCurrentUser } from '@/entities/user/index.server'
import { createSubmitSolutionSchema, formDataToSolution } from '../model/submitSolutionSchema'

type UploadedFile = {
	kind: SubmissionFileKind
	storageKey: string
	fileName: string
	mimeType: string
	sizeBytes: number
}

const upload = async (
	file: File,
	kind: SubmissionFileKind,
	prefix: string,
): Promise<UploadedFile> => ({
	kind,
	storageKey: await saveUpload(file, prefix),
	// Имя показываем пользователю, но в путь на диске оно не попадает
	fileName: file.name.slice(0, 200),
	mimeType: file.type || 'application/octet-stream',
	sizeBytes: file.size,
})

/**
 * Сдача решения. Условия: принятая заявка на задание; задание опубликовано
 * (или закрыто, но решение возвращено на доработку — его можно доделать).
 * Повторная сдача после доработки обновляет то же решение: новые файлы заменяют старые того же вида.
 */
export async function submitSolutionAction(
	taskId: number,
	formData: FormData,
): Promise<ActionResult> {
	const user = await getCurrentUser()
	if (user?.role !== 'student' || !Number.isInteger(taskId))
		return { ok: false, error: 'forbidden' }

	const [task, application, existing] = await Promise.all([
		db.task.findUnique({
			where: { id: taskId },
			select: { title: true, status: true, authorId: true, requireRepository: true },
		}),
		db.application.findUnique({
			where: { taskId_studentId: { taskId, studentId: user.id } },
			select: { status: true },
		}),
		db.submission.findUnique({
			where: { taskId_studentId: { taskId, studentId: user.id } },
			select: { id: true, status: true, files: { select: { kind: true, storageKey: true } } },
		}),
	])
	if (!task || application?.status !== ApplicationStatus.ACCEPTED) {
		return { ok: false, error: 'forbidden' }
	}

	const isResubmission = existing?.status === SubmissionStatus.CHANGES_REQUESTED
	const canSubmit =
		(task.status === TaskStatus.PUBLISHED &&
			(!existing || existing.status === SubmissionStatus.DRAFT || isResubmission)) ||
		(task.status === TaskStatus.CLOSED && isResubmission)
	if (!canSubmit) return { ok: false, error: 'invalidData' }

	const parsed = createSubmitSolutionSchema(task.requireRepository).safeParse(
		formDataToSolution(formData),
	)
	if (!parsed.success) return { ok: false, error: 'invalidData' }
	const { repositoryUrl, comment, archive, images } = parsed.data
	// Сдать пустое решение нельзя: нужна ссылка или хотя бы архив
	if (!repositoryUrl && !archive && !existing?.files.length)
		return { ok: false, error: 'invalidData' }

	const prefix = `submissions/${taskId}/${user.id}`
	const uploaded = await Promise.all([
		...(archive ? [upload(archive, SubmissionFileKind.ARCHIVE, prefix)] : []),
		...images.map(image => upload(image, SubmissionFileKind.IMAGE, prefix)),
	])
	const replacedKinds = new Set(uploaded.map(file => file.kind))
	const replacedFiles = existing?.files.filter(file => replacedKinds.has(file.kind)) ?? []

	const fields = {
		repositoryUrl: repositoryUrl || null,
		comment: comment || null,
		submittedAt: new Date(),
	}

	try {
		await transaction(async tx => {
			let submissionId: number

			if (existing) {
				submissionId = existing.id
				const changed = await changeSubmissionStatus(tx, {
					submissionId,
					from: existing.status,
					to: SubmissionStatus.SUBMITTED,
					changedById: user.id,
					data: fields,
				})
				if (!changed) throw new Error('Статус решения изменился')
				await tx.submissionFile.deleteMany({
					where: { submissionId, kind: { in: [...replacedKinds] } },
				})
			} else {
				const created = await tx.submission.create({
					data: { taskId, studentId: user.id, status: SubmissionStatus.SUBMITTED, ...fields },
					select: { id: true },
				})
				submissionId = created.id
				await tx.submissionStatusChange.create({
					data: { submissionId, toStatus: SubmissionStatus.SUBMITTED, changedById: user.id },
				})
			}

			if (uploaded.length > 0) {
				await tx.submissionFile.createMany({
					data: uploaded.map(file => ({ ...file, submissionId })),
				})
			}

			await notifyUsers(
				[task.authorId],
				{
					type: isResubmission ? 'SOLUTION_RESUBMITTED' : 'SOLUTION_RECEIVED',
					params: { taskTitle: task.title, studentName: user.name },
					link: routes.task(taskId),
				},
				tx,
			)
		})
	} catch (error) {
		await Promise.all(uploaded.map(file => storage.delete(file.storageKey)))
		console.error('submitSolutionAction', error)
		return { ok: false, error: 'unknownError' }
	}

	// Старые файлы удаляем только после успешного сохранения нового решения
	await Promise.all(replacedFiles.map(file => storage.delete(file.storageKey)))

	revalidatePath(routes.task(taskId))
	revalidatePath(routes.profile())
	return { ok: true, data: undefined }
}
