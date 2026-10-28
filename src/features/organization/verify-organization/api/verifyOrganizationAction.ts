'use server'

import { revalidatePath } from 'next/cache'
import { db, OrganizationStatus } from '@/shared/api'
import { routes } from '@/shared/config'
import type { ActionResult } from '@/shared/lib/actionResult'
import { getCurrentUser } from '@/entities/user/index.server'

export type VerificationDecision = 'approve' | 'reject'

/**
 * Решение администратора по организации. Права проверяются здесь, на сервере:
 * кнопку в интерфейсе видит только админ, но server action — публичный эндпоинт, и вызвать его может любой.
 */
export async function verifyOrganizationAction(
	organizationId: number,
	decision: VerificationDecision,
): Promise<ActionResult> {
	const user = await getCurrentUser()
	if (user?.role !== 'admin') return { ok: false, error: 'forbidden' }
	if (!Number.isInteger(organizationId)) return { ok: false, error: 'invalidData' }

	const approved = decision === 'approve'

	// updateMany с условием по статусу: решение можно принять только по организации «на проверке»
	const { count } = await db.organization.updateMany({
		where: { id: organizationId, status: OrganizationStatus.PENDING },
		data: {
			status: approved ? OrganizationStatus.VERIFIED : OrganizationStatus.REJECTED,
			verifiedAt: approved ? new Date() : null,
			verifiedById: user.id,
		},
	})
	if (count === 0) return { ok: false, error: 'invalidData' }

	const employers = await db.employerProfile.findMany({
		where: { organizationId },
		select: { userId: true },
	})
	await db.notification.createMany({
		data: employers.map(({ userId }) => ({
			userId,
			// TODO(этап 4): тексты уведомлений — на языке получателя
			title: approved ? 'Организация подтверждена' : 'Организация не прошла проверку',
			body: approved
				? 'Теперь вы можете публиковать задания.'
				: 'Свяжитесь с администратором платформы, чтобы уточнить причину.',
			link: routes.profile(),
		})),
	})

	revalidatePath(routes.profile())
	return { ok: true, data: undefined }
}
