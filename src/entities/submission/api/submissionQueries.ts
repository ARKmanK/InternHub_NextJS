import { db, SubmissionFileKind, SubmissionStatus, type Prisma } from '@/shared/api'
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

const submissionInclude = {
	student: {
		select: { name: true, studentProfile: { select: { firstName: true, lastName: true } } },
	},
	files: { select: { id: true, kind: true, fileName: true, sizeBytes: true } },
} satisfies Prisma.SubmissionInclude

type SubmissionRow = Prisma.SubmissionGetPayload<{ include: typeof submissionInclude }>

const toSubmissionDto = (row: SubmissionRow): ISubmission => ({
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
})

// Вызываются только на сервере.

/** Решения по заданию для таблицы активности. Черновики не показываем — это ещё не решение. */
export async function getSubmissionsByTask(taskId: number): Promise<ISubmission[]> {
	const rows = await db.submission.findMany({
		where: { taskId, status: { not: SubmissionStatus.DRAFT } },
		include: submissionInclude,
		orderBy: { submittedAt: 'desc' },
	})
	return rows.map(toSubmissionDto)
}

/** Решение конкретного студента по заданию (или null). */
export async function getStudentSubmission(
	taskId: number,
	studentId: string,
): Promise<ISubmission | null> {
	const row = await db.submission.findUnique({
		where: { taskId_studentId: { taskId, studentId } },
		include: submissionInclude,
	})
	return row ? toSubmissionDto(row) : null
}
