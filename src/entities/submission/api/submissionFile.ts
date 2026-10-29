import { db } from '@/shared/api'

type Viewer = { id: string; role: 'student' | 'employer' | 'teacher' | 'admin' } | null

/**
 * Файл решения для скачивания. Доступ: сам студент, автор задания и администратор.
 * null — файла нет или доступа нет (наружу оба случая выглядят одинаково).
 */
export async function getSubmissionFileForViewer(fileId: number, viewer: Viewer) {
	if (!viewer) return null

	const file = await db.submissionFile.findUnique({
		where: { id: fileId },
		select: {
			storageKey: true,
			fileName: true,
			mimeType: true,
			submission: { select: { studentId: true, task: { select: { authorId: true } } } },
		},
	})
	if (!file) return null

	const { studentId, task } = file.submission
	const allowed = viewer.role === 'admin' || viewer.id === studentId || viewer.id === task.authorId
	return allowed
		? { storageKey: file.storageKey, fileName: file.fileName, mimeType: file.mimeType }
		: null
}
