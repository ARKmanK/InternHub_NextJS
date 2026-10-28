/**
 * Жизненный цикл решения студента (этап 1, диаграмма состояний):
 * draft → submitted ⇄ changes_requested → accepted | rejected.
 * TODO(этап 1): типы будут генерироваться из schema.prisma.
 */
export const SUBMISSION_STATUSES = [
	'draft',
	'submitted',
	'changes_requested',
	'accepted',
	'rejected',
] as const

export type SubmissionStatus = (typeof SUBMISSION_STATUSES)[number]

export interface ISubmission {
	id: number
	taskId: number
	studentId: number
	studentName: string
	status: SubmissionStatus
	repositoryUrl: string | null
	archiveUrl: string | null
	imageUrls: string[]
	comment: string | null
	reviewComment: string | null
	submittedAt: string
}
