import { extname } from 'node:path'
import { db } from '@/shared/api'
import { getTaskById, type TaskViewer } from './taskQueries'

/**
 * Архив с материалами задания — для того, кому видно само задание (те же правила, что у страницы).
 * null — архива нет или задание этому пользователю недоступно.
 */
export async function getTaskArchive(
	taskId: number,
	viewer: TaskViewer,
): Promise<{ storageKey: string; fileName: string } | null> {
	const task = await getTaskById(taskId, viewer)
	if (!task?.hasArchive) return null

	const row = await db.task.findUnique({ where: { id: taskId }, select: { archiveKey: true } })
	if (!row?.archiveKey) return null

	return {
		storageKey: row.archiveKey,
		fileName: `task-${taskId}-materials${extname(row.archiveKey)}`,
	}
}
