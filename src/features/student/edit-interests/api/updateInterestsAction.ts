'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { db } from '@/shared/api'
import { routes } from '@/shared/config'
import type { ActionResult } from '@/shared/lib/actionResult'
import { getCurrentUser } from '@/entities/user/index.server'
import { MAX_INTERESTS } from '../model/interests'

const interestsSchema = z.array(z.number().int().positive()).max(MAX_INTERESTS)

/** Интересы студента — компетенции, которые он хочет развивать. Влияют на рекомендации. */
export async function updateInterestsAction(ids: number[]): Promise<ActionResult> {
	const user = await getCurrentUser()
	if (user?.role !== 'student') return { ok: false, error: 'forbidden' }

	const parsed = interestsSchema.safeParse(ids)
	if (!parsed.success) return { ok: false, error: 'invalidData' }

	// Только существующие компетенции из справочника
	const existing = await db.competency.findMany({
		where: { id: { in: [...new Set(parsed.data)] } },
		select: { id: true },
	})
	await db.studentProfile.update({
		where: { userId: user.id },
		data: { interests: { set: existing } },
	})

	revalidatePath(routes.profile())
	return { ok: true, data: undefined }
}
