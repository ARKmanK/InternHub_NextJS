'use server'

import { revalidatePath } from 'next/cache'
import { db, TaskStatus } from '@/shared/api'
import { routes } from '@/shared/config'
import type { ActionResult } from '@/shared/lib/actionResult'
import { findTeacherPractice } from '@/entities/practice/index.server'
import { getCurrentUser } from '@/entities/user/index.server'

const getTeacherPractice = async (practiceId: number) => {
	const user = await getCurrentUser()
	if (user?.role !== 'teacher') return null
	return findTeacherPractice(practiceId, user.id)
}

/** Добавляет в практику опубликованное задание. Студенты практики выполняют его в общем порядке (заявка → решение). */
export async function addPracticeTaskAction(
	practiceId: number,
	taskId: number,
): Promise<ActionResult> {
	const practice = await getTeacherPractice(practiceId)
	if (!practice || !Number.isInteger(taskId)) return { ok: false, error: 'forbidden' }

	const task = await db.task.findFirst({
		where: { id: taskId, status: TaskStatus.PUBLISHED },
		select: { id: true },
	})
	if (!task) return { ok: false, error: 'invalidData' }

	await db.practiceTask.createMany({ data: [{ practiceId, taskId }], skipDuplicates: true })

	revalidatePath(routes.practice(practiceId))
	return { ok: true, data: undefined }
}

export async function removePracticeTaskAction(
	practiceId: number,
	taskId: number,
): Promise<ActionResult> {
	const practice = await getTeacherPractice(practiceId)
	if (!practice) return { ok: false, error: 'forbidden' }

	await db.practiceTask.deleteMany({ where: { practiceId, taskId } })

	revalidatePath(routes.practice(practiceId))
	return { ok: true, data: undefined }
}
