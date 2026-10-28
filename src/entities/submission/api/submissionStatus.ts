import { SubmissionStatus, type Prisma } from '@/shared/api'

/** Разрешённые переходы статуса решения (docs/02-data-model.md, диаграмма состояний). */
const TRANSITIONS: Record<SubmissionStatus, readonly SubmissionStatus[]> = {
	[SubmissionStatus.DRAFT]: [SubmissionStatus.SUBMITTED],
	[SubmissionStatus.SUBMITTED]: [
		SubmissionStatus.ACCEPTED,
		SubmissionStatus.CHANGES_REQUESTED,
		SubmissionStatus.REJECTED,
	],
	[SubmissionStatus.CHANGES_REQUESTED]: [SubmissionStatus.SUBMITTED],
	[SubmissionStatus.ACCEPTED]: [],
	[SubmissionStatus.REJECTED]: [],
}

export const canChangeSubmissionStatus = (from: SubmissionStatus, to: SubmissionStatus) =>
	TRANSITIONS[from].includes(to)

type ChangeSubmissionStatus = {
	submissionId: number
	from: SubmissionStatus
	to: SubmissionStatus
	changedById: string
	comment?: string | null
	data?: Prisma.SubmissionUpdateManyMutationInput
}

/** Меняет статус решения и пишет историю. Атомарно, как changeTaskStatus. Вызывать внутри транзакции. */
export async function changeSubmissionStatus(
	tx: Prisma.TransactionClient,
	{ submissionId, from, to, changedById, comment, data }: ChangeSubmissionStatus,
): Promise<boolean> {
	if (!canChangeSubmissionStatus(from, to)) return false

	const { count } = await tx.submission.updateMany({
		where: { id: submissionId, status: from },
		data: { ...data, status: to },
	})
	if (count === 0) return false

	await tx.submissionStatusChange.create({
		data: { submissionId, fromStatus: from, toStatus: to, changedById, comment: comment ?? null },
	})
	return true
}
