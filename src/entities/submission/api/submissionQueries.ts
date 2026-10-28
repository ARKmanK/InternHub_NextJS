import type { ISubmission } from '../model/ISubmission'

// Вызывается только на сервере. TODO(этап 1): Prisma.
export async function getSubmissionsByTask(_taskId: number): Promise<ISubmission[]> {
	return []
}
