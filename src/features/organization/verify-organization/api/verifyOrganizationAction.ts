'use server'

import { revalidatePath } from 'next/cache'
import { db, OrganizationStatus } from '@/shared/api'
import { routes } from '@/shared/config'
import type { ActionResult } from '@/shared/lib/actionResult'
import { notifyUsers } from '@/entities/notification/index.server'
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
	await notifyUsers(
		employers.map(employer => employer.userId),
		{
			type: approved ? 'ORGANIZATION_VERIFIED' : 'ORGANIZATION_REJECTED',
			link: routes.profile(),
		},
	)

	revalidatePath(routes.profile())
	return { ok: true, data: undefined }
}
