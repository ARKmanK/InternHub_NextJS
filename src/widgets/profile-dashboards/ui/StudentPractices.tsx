import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { routes } from '@/shared/config'
import { PracticeCard, PracticeGradeBadge, type IStudentPractice } from '@/entities/practice'
import { SubmissionStatusBadge } from '@/entities/submission'

/** Практики студента: задания со своими статусами и итоговая оценка преподавателя. */
export async function StudentPractices({ practices }: { practices: IStudentPractice[] }) {
	const t = await getTranslations('ProfileDashboards')

	return (
		<section className='flex flex-col gap-4'>
			<h2 className='text-lg font-medium'>{t('myPractices')}</h2>
			{practices.map(({ practice, tasks, grade, gradeComment }) => (
				<PracticeCard
					key={practice.id}
					practice={practice}
					action={<PracticeGradeBadge grade={grade} />}
				>
					{gradeComment && <p className='text-sm'>{gradeComment}</p>}
					{tasks.length > 0 && (
						<ul className='flex flex-col gap-2'>
							{tasks.map(task => (
								<li key={task.id} className='flex flex-wrap items-center justify-between gap-2'>
									<Link href={routes.task(task.id)} className='text-sm hover:underline'>
										{task.title}
									</Link>
									{task.result ? (
										<SubmissionStatusBadge status={task.result.status} />
									) : (
										<span className='text-sm text-muted-foreground'>{t('notStarted')}</span>
									)}
								</li>
							))}
						</ul>
					)}
				</PracticeCard>
			))}
		</section>
	)
}
