import { notFound, redirect } from 'next/navigation'
import { routes } from '@/shared/config'
import { getPracticeProgress } from '@/entities/practice/index.server'
import { getCurrentUser } from '@/entities/user/index.server'
import { PracticeForm } from '@/features/practice/practice-form'

export async function PracticeEditPage({ id }: { id: number }) {
	const user = await getCurrentUser()
	if (user?.role !== 'teacher') redirect(routes.profile())

	// Чужая практика выглядит так же, как несуществующая
	const progress = await getPracticeProgress(id, user.id)
	if (!progress) notFound()
	const { practice } = progress

	return (
		<PracticeForm
			mode='edit'
			practiceId={practice.id}
			defaultValues={{
				title: practice.title,
				description: practice.description ?? '',
				startsAt: practice.startsAt,
				endsAt: practice.endsAt,
			}}
		/>
	)
}
