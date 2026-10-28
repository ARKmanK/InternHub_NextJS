import { db, OrganizationStatus } from '@/shared/api'
import type { IOrganization } from '../model/IOrganization'

const statusToDto = {
	[OrganizationStatus.PENDING]: 'pending',
	[OrganizationStatus.VERIFIED]: 'verified',
	[OrganizationStatus.REJECTED]: 'rejected',
	[OrganizationStatus.BLOCKED]: 'blocked',
} as const satisfies Record<OrganizationStatus, IOrganization['status']>

/**
 * Организации, ожидающие проверки, — старые сверху. Вызывается только на сервере.
 * Показываем только те, где представитель подтвердил почту: иначе администратор тратил бы время на брошенные заявки.
 */
export async function getOrganizationsForReview(): Promise<IOrganization[]> {
	const rows = await db.organization.findMany({
		where: {
			status: OrganizationStatus.PENDING,
			employers: { some: { user: { emailVerified: true } } },
		},
		include: { employers: { select: { user: { select: { name: true, email: true } } } } },
		orderBy: { createdAt: 'asc' },
	})

	return rows.map(row => ({
		id: row.id,
		name: row.name,
		inn: row.inn,
		ogrn: row.ogrn,
		status: statusToDto[row.status],
		contacts: row.employers.map(employer => employer.user),
		createdAt: row.createdAt.toISOString(),
	}))
}
