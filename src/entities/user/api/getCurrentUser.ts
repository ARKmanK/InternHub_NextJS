import { cache } from 'react'
import { headers } from 'next/headers'
import { auth, db, OrganizationStatus } from '@/shared/api'
import type { IUser } from '../model/IUser'
import { roleToDto } from './roleToDto'

const organizationStatusToDto = {
	[OrganizationStatus.PENDING]: 'pending',
	[OrganizationStatus.VERIFIED]: 'verified',
	[OrganizationStatus.REJECTED]: 'rejected',
	[OrganizationStatus.BLOCKED]: 'blocked',
} as const satisfies Record<OrganizationStatus, NonNullable<IUser['organization']>['status']>

/**
 * Текущий пользователь по куке сессии. Вызывается только на сервере.
 *
 * Better Auth проверяет сессию (подпись, срок, запись в БД), а роль и организацию мы читаем
 * из своей таблицы — значения, присланные клиентом, здесь не участвуют.
 * cache() — шапка, страница и generateMetadata в одном запросе получают пользователя одним обращением к БД.
 */
export const getCurrentUser = cache(async (): Promise<IUser | null> => {
	const session = await auth.api.getSession({ headers: await headers() })
	if (!session) return null

	const user = await db.user.findUnique({
		where: { id: session.user.id },
		select: {
			id: true,
			email: true,
			name: true,
			role: true,
			locale: true,
			employerProfile: {
				select: { organization: { select: { id: true, name: true, status: true } } },
			},
		},
	})
	if (!user) return null

	const organization = user.employerProfile?.organization

	return {
		id: user.id,
		email: user.email,
		name: user.name,
		role: roleToDto[user.role],
		locale: user.locale,
		organization: organization && {
			id: organization.id,
			name: organization.name,
			status: organizationStatusToDto[organization.status],
		},
	}
})
