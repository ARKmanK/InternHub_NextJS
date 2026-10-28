import { fileResponse } from '@/shared/api'
import { getTaskArchive } from '@/entities/task/index.server'
import { getCurrentUser } from '@/entities/user/index.server'

// Архив с материалами задания. Права — как у страницы задания (черновик видят только автор и админ)
export async function GET(
	_request: Request,
	{ params }: RouteContext<'/api/files/tasks/[taskId]'>,
) {
	const taskId = Number((await params).taskId)
	if (!Number.isInteger(taskId)) return new Response('Not Found', { status: 404 })

	const archive = await getTaskArchive(taskId, await getCurrentUser())
	if (!archive) return new Response('Not Found', { status: 404 })

	return fileResponse(archive.storageKey, archive.fileName)
}
