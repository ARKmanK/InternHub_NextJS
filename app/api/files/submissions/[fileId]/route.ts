import { fileResponse } from '@/shared/api'
import { getSubmissionFileForViewer } from '@/entities/submission/index.server'
import { getCurrentUser } from '@/entities/user/index.server'

// Файл решения: студент-автор, работодатель — автор задания и администратор
export async function GET(
	_request: Request,
	{ params }: RouteContext<'/api/files/submissions/[fileId]'>,
) {
	const fileId = Number((await params).fileId)
	if (!Number.isInteger(fileId)) return new Response('Not Found', { status: 404 })

	const file = await getSubmissionFileForViewer(fileId, await getCurrentUser())
	if (!file) return new Response('Not Found', { status: 404 })

	return fileResponse(file.storageKey, file.fileName, file.mimeType)
}
