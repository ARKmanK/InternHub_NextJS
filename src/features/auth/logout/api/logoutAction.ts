'use server'

import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { auth } from '@/shared/api'
import { routes } from '@/shared/config'

/** Удаляет сессию в базе и куку, затем ведёт на главную. */
export async function logoutAction() {
	await auth.api.signOut({ headers: await headers() })
	redirect(routes.home())
}
