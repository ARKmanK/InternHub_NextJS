import { db, SubmissionFileKind, SubmissionStatus } from '@/shared/api'
import type { ISubmission } from '../model/ISubmission'

const statusToDto = {
	[SubmissionStatus.DRAFT]: 'draft',
	[SubmissionStatus.SUBMITTED]: 'submitted',
	[SubmissionStatus.CHANGES_REQUESTED]: 'changes_requested',
	[SubmissionStatus.ACCEPTED]: 'accepted',
	[SubmissionStatus.REJECTED]: 'rejected',
} as const satisfies Record<SubmissionStatus, ISubmission['status']>

const fileKindToDto = {
	[SubmissionFileKind.ARCHIVE]: 'archive',
	[SubmissionFileKind.IMAGE]: 'image',
} as const satisfies Record<SubmissionFileKind, 'archive' | 'image'>

/**
 * Решения по заданию для таблицы активности. Черновики не показываем — это ещё не решение.
 * Вызывается только на сервере.
 */
export async function getSubmissionsByTask(taskId: number): Promise<ISubmission[]> {
	const rows = await db.submission.findMany({
		where: { taskId, status: { not: SubmissionStatus.DRAFT } },
		include: {
			student: {
				select: { name: true, studentProfile: { select: { firstName: true, lastName: true } } },
			},
			files: { select: { id: true, kind: true, fileName: true, sizeBytes: true } },
		},
		orderBy: { submittedAt: 'desc' },
	})

	return rows.map(row => ({
		id: row.id,
		taskId: row.taskId,
		studentId: row.studentId,
		studentName: row.student.studentProfile
			? `${row.student.studentProfile.firstName} ${row.student.studentProfile.lastName}`
			: row.student.name,
		status: statusToDto[row.status],
		repositoryUrl: row.repositoryUrl,
		comment: row.comment,
		score: row.score,
		reviewComment: row.reviewComment,
		files: row.files.map(file => ({ ...file, kind: fileKindToDto[file.kind] })),
		submittedAt: row.submittedAt?.toISOString() ?? null,
	}))
}
