'use server'

import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { auth, db, UserRole } from '@/shared/api'
import { routes } from '@/shared/config'
import type { ActionResult } from '@/shared/lib/actionResult'
import { getCurrentUser } from '@/entities/user/index.server'
import { inviteTeacherSchema, type InviteTeacherValues } from '../model/inviteTeacherSchema'

/**
 * Приглашение преподавателя. Роль TEACHER выбрать при регистрации нельзя — её даёт только администратор.
 *
 * Создаём учётную запись без пароля и отправляем ссылку «задайте пароль» (это ссылка сброса пароля
 * Better Auth; письмо для пользователя без пароля — приглашение). Переход по ссылке доказывает,
 * что почта принадлежит преподавателю. Повторный вызов для ещё не активированного преподавателя
 * просто отправляет ссылку заново.
 */
export async function inviteTeacherAction(values: InviteTeacherValues): Promise<ActionResult> {
	const admin = await getCurrentUser()
	if (admin?.role !== 'admin') return { ok: false, error: 'forbidden' }

	const parsed = inviteTeacherSchema.safeParse(values)
	if (!parsed.success) return { ok: false, error: 'invalidData' }
	const email = parsed.data.email.toLowerCase()

	const existing = await db.user.findUnique({
		where: { email },
		select: {
			role: true,
			accounts: { where: { providerId: 'credential' }, select: { id: true } },
		},
	})
	// Существующего студента или работодателя молча в преподаватели не превращаем
	if (existing && (existing.role !== UserRole.TEACHER || existing.accounts.length > 0)) {
		return { ok: false, error: 'userExists' }
	}

	if (!existing) {
		await db.user.create({
			data: {
				name: parsed.data.name,
				email,
				role: UserRole.TEACHER,
				// Почта подтвердится переходом по ссылке: без неё пароль не задать и не войти
				emailVerified: true,
				locale: admin.locale,
			},
		})
	}

	await auth.api.requestPasswordReset({
		body: { email, redirectTo: routes.resetPassword() },
		headers: await headers(),
	})

	revalidatePath(routes.profile())
	return { ok: true, data: undefined }
}
