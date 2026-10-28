import { getFormatter, getTranslations } from 'next-intl/server'
import {
	Item,
	ItemActions,
	ItemContent,
	ItemDescription,
	ItemGroup,
	ItemTitle,
} from '@/shared/ui/item'
import { ApplicationStatusBadge } from '@/entities/application'
import { getApplicationsByTask } from '@/entities/application/index.server'
import { ReviewApplicationActions } from '@/features/application/review-application'

type TaskApplicationsProps = {
	taskId: number
	maxParticipants: number | null
}

/** Заявки на задание — видит только автор (проверку делает страница). */
export async function TaskApplications({ taskId, maxParticipants }: TaskApplicationsProps) {
	const t = await getTranslations('TaskApplications')
	const format = await getFormatter()
	const applications = await getApplicationsByTask(taskId)
	const acceptedCount = applications.filter(item => item.status === 'accepted').length

	return (
		<section className='flex flex-col gap-3'>
			<div className='flex items-baseline justify-between gap-4'>
				<h2 className='text-lg font-semibold'>{t('title')}</h2>
				<span className='text-sm text-muted-foreground'>
					{maxParticipants === null
						? t('acceptedUnlimited', { count: acceptedCount })
						: t('acceptedOf', { count: acceptedCount, max: maxParticipants })}
				</span>
			</div>
			{applications.length === 0 ? (
				<p className='text-sm text-muted-foreground'>{t('empty')}</p>
			) : (
				<ItemGroup className='gap-2'>
					{applications.map(application => (
						<Item key={application.id} variant='outline'>
							<ItemContent>
								<ItemTitle>
									{application.studentName}
									{application.studentGroup && (
										<span className='font-normal text-muted-foreground'>
											{' '}
											· {application.studentGroup},{' '}
											{t('course', { course: application.studentCourse ?? '—' })}
										</span>
									)}
								</ItemTitle>
								{application.message && (
									<ItemDescription className='whitespace-pre-line'>
										{application.message}
									</ItemDescription>
								)}
								<span className='text-xs text-muted-foreground'>
									{format.dateTime(new Date(application.createdAt), { dateStyle: 'medium' })}
								</span>
							</ItemContent>
							<ItemActions>
								{application.status === 'pending' ? (
									<ReviewApplicationActions applicationId={application.id} />
								) : (
									<ApplicationStatusBadge status={application.status} />
								)}
							</ItemActions>
						</Item>
					))}
				</ItemGroup>
			)}
		</section>
	)
}
