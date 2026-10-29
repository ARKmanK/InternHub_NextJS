import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { Pencil } from 'lucide-react'
import { routes } from '@/shared/config'
import { BackButton } from '@/shared/ui/back-button'
import { Button } from '@/shared/ui/button'
import { PracticeCard } from '@/entities/practice'
import { getAvailableTasksForPractice, getPracticeProgress } from '@/entities/practice/index.server'
import { getCurrentUser } from '@/entities/user/index.server'
import { AddStudentsForm } from '@/features/practice/manage-students'
import { AddPracticeTaskForm } from '@/features/practice/manage-tasks'
import { PracticeReportButton } from '@/features/practice/practice-report'
import { PracticeProgressTable } from '@/widgets/practice-progress'

/** Страница практики — рабочее место преподавателя: состав, задания, прогресс и оценки. */
export async function PracticePage({ id }: { id: number }) {
	const t = await getTranslations('PracticePage')
	const user = await getCurrentUser()
	if (user?.role !== 'teacher') redirect(routes.profile())

	const [progress, available] = await Promise.all([
		getPracticeProgress(id, user.id),
		getAvailableTasksForPractice(id),
	])
	if (!progress) notFound()

	return (
		<div className='flex flex-col gap-6'>
			<div className='flex flex-wrap items-center justify-between gap-2'>
				<BackButton />
				<PracticeReportButton practiceId={id} />
			</div>

			<PracticeCard
				practice={progress.practice}
				action={
					<Button asChild variant='ghost' size='icon' aria-label={t('edit')}>
						<Link href={routes.practiceEdit(id)}>
							<Pencil />
						</Link>
					</Button>
				}
			/>

			<div className='grid gap-6 md:grid-cols-2'>
				<section className='flex flex-col gap-3'>
					<h2 className='text-lg font-semibold'>{t('addStudents')}</h2>
					<AddStudentsForm practiceId={id} />
				</section>
				<section className='flex flex-col gap-3'>
					<h2 className='text-lg font-semibold'>{t('addTask')}</h2>
					<AddPracticeTaskForm
						practiceId={id}
						options={available.map(task => ({
							id: task.id,
							title: task.title,
							companyName: task.organization.name,
						}))}
					/>
				</section>
			</div>

			<PracticeProgressTable progress={progress} />
		</div>
	)
}
