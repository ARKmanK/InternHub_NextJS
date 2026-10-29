'use server'

import { revalidatePath } from 'next/cache'
import { db } from '@/shared/api'
import { routes } from '@/shared/config'
import type { ActionResult } from '@/shared/lib/actionResult'
import { getCurrentUser } from '@/entities/user/index.server'
import { practiceSchema, toDbDate, type PracticeValues } from '../model/practiceSchema'

const toData = (values: PracticeValues) => ({
	title: values.title,
	description: values.description || null,
	startsAt: toDbDate(values.startsAt),
	endsAt: toDbDate(values.endsAt),
})

/** Новая практика. Создавать может только преподаватель — он и становится её руководителем. */
export async function createPracticeAction(
	values: PracticeValues,
): Promise<ActionResult<{ id: number }>> {
	const user = await getCurrentUser()
	if (user?.role !== 'teacher') return { ok: false, error: 'forbidden' }

	const parsed = practiceSchema.safeParse(values)
	if (!parsed.success) return { ok: false, error: 'invalidData' }

	const practice = await db.practice.create({
		data: { ...toData(parsed.data), teacherId: user.id },
		select: { id: true },
	})

	revalidatePath(routes.profile())
	return { ok: true, data: { id: practice.id } }
}

/** Изменить можно только свою практику (условие teacherId в запросе). */
export async function updatePracticeAction(
	practiceId: number,
	values: PracticeValues,
): Promise<ActionResult<{ id: number }>> {
	const user = await getCurrentUser()
	if (user?.role !== 'teacher' || !Number.isInteger(practiceId)) {
		return { ok: false, error: 'forbidden' }
	}

	const parsed = practiceSchema.safeParse(values)
	if (!parsed.success) return { ok: false, error: 'invalidData' }

	const { count } = await db.practice.updateMany({
		where: { id: practiceId, teacherId: user.id },
		data: toData(parsed.data),
	})
	if (count === 0) return { ok: false, error: 'forbidden' }

	revalidatePath(routes.practice(practiceId))
	revalidatePath(routes.profile())
	return { ok: true, data: { id: practiceId } }
}
