'use server'

import { revalidatePath } from 'next/cache'
import { db, UserRole, type Prisma } from '@/shared/api'
import { routes } from '@/shared/config'
import type { ActionResult } from '@/shared/lib/actionResult'
import { notifyUsers } from '@/entities/notification/index.server'
import { findTeacherPractice } from '@/entities/practice/index.server'
import { getCurrentUser } from '@/entities/user/index.server'

export type AddStudentsMode = 'group' | 'email'

const getTeacherPractice = async (practiceId: number) => {
	const user = await getCurrentUser()
	if (user?.role !== 'teacher') return null
	return findTeacherPractice(practiceId, user.id)
}

/**
 * Добавляет в практику студентов: всю группу (по названию группы из профиля) или одного по почте.
 * Учитываются только студенты с подтверждённой почтой. Кто уже в практике — пропускается.
 * Возвращает, сколько добавлено, и уведомляет новых участников.
 */
export async function addStudentsAction(
	practiceId: number,
	mode: AddStudentsMode,
	rawValue: string,
): Promise<ActionResult<{ added: number }>> {
	const practice = await getTeacherPractice(practiceId)
	if (!practice) return { ok: false, error: 'forbidden' }

	const value = rawValue.trim()
	if (value.length < 2 || value.length > 254) return { ok: false, error: 'invalidData' }

	const filter: Prisma.UserWhereInput =
		mode === 'group'
			? { studentProfile: { group: { equals: value, mode: 'insensitive' } } }
			: { email: value.toLowerCase() }

	const candidates = await db.user.findMany({
		where: {
			...filter,
			role: UserRole.STUDENT,
			emailVerified: true,
			practices: { none: { practiceId } },
		},
		select: { id: true },
	})
	if (candidates.length === 0) return { ok: true, data: { added: 0 } }

	const studentIds = candidates.map(student => student.id)
	await db.$transaction(async tx => {
		await tx.practiceStudent.createMany({
			data: studentIds.map(studentId => ({ practiceId, studentId })),
			skipDuplicates: true,
		})
		await notifyUsers(
			studentIds,
			{ type: 'PRACTICE_ADDED', params: { practiceTitle: practice.title }, link: routes.profile() },
			tx,
		)
	})

	revalidatePath(routes.practice(practiceId))
	return { ok: true, data: { added: studentIds.length } }
}

/** Убирает студента из практики. Его решения по заданиям остаются — они принадлежат студенту. */
export async function removeStudentAction(
	practiceId: number,
	studentId: string,
): Promise<ActionResult> {
	const practice = await getTeacherPractice(practiceId)
	if (!practice) return { ok: false, error: 'forbidden' }

	await db.practiceStudent.deleteMany({ where: { practiceId, studentId } })

	revalidatePath(routes.practice(practiceId))
	return { ok: true, data: undefined }
}
