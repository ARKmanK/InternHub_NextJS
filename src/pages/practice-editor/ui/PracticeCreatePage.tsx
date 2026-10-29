import { redirect } from 'next/navigation'
import { routes } from '@/shared/config'
import { getCurrentUser } from '@/entities/user/index.server'
import { PracticeForm } from '@/features/practice/practice-form'

export async function PracticeCreatePage() {
	const user = await getCurrentUser()
	// Создавать практики может только преподаватель; server action повторит проверку
	if (user?.role !== 'teacher') redirect(routes.profile())

	return <PracticeForm mode='create' />
}
