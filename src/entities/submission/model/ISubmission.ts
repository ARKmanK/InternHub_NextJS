/**
 * Жизненный цикл решения студента (docs/02-data-model.md, диаграмма состояний):
 * draft → submitted ⇄ changes_requested → accepted | rejected.
 * DTO для интерфейса; enum'ы Prisma переводятся в entities/submission/api/submissionMapper.ts.
 */
export const SUBMISSION_STATUSES = [
	'draft',
	'submitted',
	'changes_requested',
	'accepted',
	'rejected',
] as const

export type SubmissionStatus = (typeof SUBMISSION_STATUSES)[number]

export interface ISubmissionFile {
	id: number
	kind: 'archive' | 'image'
	fileName: string
	sizeBytes: number
}

export interface ISubmission {
	id: number
	taskId: number
	studentId: string
	studentName: string
	status: SubmissionStatus
	repositoryUrl: string | null
	comment: string | null
	score: number | null
	reviewComment: string | null
	/** Файлы лежат в хранилище; ссылку на скачивание выдаёт сервер после проверки прав (этап 3). */
	files: ISubmissionFile[]
	submittedAt: string | null
}
