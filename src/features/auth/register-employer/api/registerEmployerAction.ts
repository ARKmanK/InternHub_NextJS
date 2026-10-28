'use server'

import {
	db,
	getAuthErrorCode,
	OrganizationStatus,
	Prisma,
	signUpWithEmail,
	UserRole,
} from '@/shared/api'
import { routes } from '@/shared/config'
import type { ActionResult } from '@/shared/lib/actionResult'
import { checkRateLimit, getClientIp } from '@/shared/lib/rateLimit'
import {
	registerEmployerSchema,
	type RegisterEmployerFormValues,
} from '../model/registerEmployerSchema'

/**
 * Регистрация работодателя: учётная запись + новая организация со статусом PENDING + профиль сотрудника.
 * Роль EMPLOYER назначает сервер. Публиковать задания можно будет после проверки организации администратором.
 *
 * Присоединиться к уже зарегистрированной организации по ИНН нельзя: иначе любой, кто знает ИНН,
 * стал бы её сотрудником. Добавление сотрудников в существующую организацию — отдельная функция (этап 5).
 */
export async function registerEmployerAction(
	values: RegisterEmployerFormValues,
): Promise<ActionResult> {
	if (!checkRateLimit(`register:${await getClientIp()}`, { limit: 5, windowSeconds: 60 })) {
		return { ok: false, error: 'tooManyRequests' }
	}

	const parsed = registerEmployerSchema.safeParse(values)
	if (!parsed.success) return { ok: false, error: 'invalidData' }
	const { contactName, companyName, inn, ogrn, email, password } = parsed.data

	const innTaken = await db.organization.findUnique({ where: { inn }, select: { id: true } })
	if (innTaken) return { ok: false, error: 'innTaken' }

	let signUp
	try {
		signUp = await signUpWithEmail({
			name: contactName,
			email,
			password,
			callbackURL: routes.profile(),
		})
	} catch (error) {
		console.error('registerEmployerAction', getAuthErrorCode(error) ?? error)
		return { ok: false, error: 'unknownError' }
	}

	if (signUp.status === 'existing') return { ok: true, data: undefined }
	const userId = signUp.userId

	try {
		// Всё или ничего: организация, профиль и роль меняются в одной транзакции
		await db.$transaction([
			db.organization.create({
				data: {
					name: companyName,
					inn,
					ogrn: ogrn || null,
					status: OrganizationStatus.PENDING,
					employers: { create: { userId } },
				},
			}),
			db.user.update({ where: { id: userId }, data: { role: UserRole.EMPLOYER } }),
		])
	} catch (error) {
		await db.user.delete({ where: { id: userId } }).catch(() => {})
		// Две регистрации с одним ИНН одновременно: вторая упрётся в уникальный индекс
		if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
			return { ok: false, error: 'innTaken' }
		}
		console.error('registerEmployerAction: organization', error)
		return { ok: false, error: 'unknownError' }
	}

	return { ok: true, data: undefined }
}
