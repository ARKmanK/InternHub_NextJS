import { getTranslations } from 'next-intl/server'
import { CircleCheck, Hourglass, Info, RotateCcw, XCircle, type LucideIcon } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/shared/ui/alert'
import { getStudentApplication } from '@/entities/application/index.server'
import { getStudentSubmission } from '@/entities/submission/index.server'
import type { ITask } from '@/entities/task'
import { ApplyToTaskButton } from '@/features/application/apply-to-task'
import { SubmitSolutionForm } from '@/features/submission/submit-solution'

type TaskParticipationProps = {
	task: ITask
	studentId: string
}

type Notice = {
	icon: LucideIcon
	title: string
	description?: string | null
	variant?: 'default' | 'destructive'
}

/**
 * Что видит студент на странице задания — по шагам:
 * заявка → ожидание решения работодателя → сдача решения → проверка (доработка) → результат.
 */
export async function TaskParticipation({ task, studentId }: TaskParticipationProps) {
	const t = await getTranslations('TaskParticipation')
	const [application, submission] = await Promise.all([
		getStudentApplication(task.id, studentId),
		getStudentSubmission(task.id, studentId),
	])

	const isOpen = task.status === 'published'
	const notice = (props: Notice) => <ParticipationNotice {...props} />

	if (!application || application.status === 'withdrawn') {
		return isOpen ? (
			<div>
				<ApplyToTaskButton taskId={task.id} />
			</div>
		) : (
			notice({ icon: Info, title: t('closedTitle'), description: t('closedDescription') })
		)
	}

	if (application.status === 'pending') {
		return notice({
			icon: Hourglass,
			title: t('pendingTitle'),
			description: t('pendingDescription'),
		})
	}
	if (application.status === 'declined') {
		return notice({ icon: XCircle, title: t('declinedTitle'), variant: 'destructive' })
	}

	// Заявка принята — дальше всё определяет решение
	switch (submission?.status) {
		case 'submitted':
			return notice({
				icon: Hourglass,
				title: t('submittedTitle'),
				description: t('submittedDescription'),
			})
		case 'accepted':
			return notice({
				icon: CircleCheck,
				title: t('acceptedTitle', { score: submission.score ?? '—' }),
				description: submission.reviewComment,
			})
		case 'rejected':
			return notice({
				icon: XCircle,
				title: t('rejectedTitle'),
				description: submission.reviewComment,
				variant: 'destructive',
			})
		case 'changes_requested':
			return (
				<div className='flex flex-col gap-4'>
					{notice({
						icon: RotateCcw,
						title: t('changesTitle'),
						description: submission.reviewComment,
					})}
					<SubmitSolutionForm
						taskId={task.id}
						requireRepository={task.requireRepository}
						previous={{ repositoryUrl: submission.repositoryUrl, comment: submission.comment }}
					/>
				</div>
			)
		default:
			return isOpen ? (
				<SubmitSolutionForm taskId={task.id} requireRepository={task.requireRepository} />
			) : (
				notice({ icon: Info, title: t('closedTitle'), description: t('closedDescription') })
			)
	}
}

function ParticipationNotice({ icon: Icon, title, description, variant = 'default' }: Notice) {
	return (
		<Alert variant={variant}>
			<Icon />
			<AlertTitle>{title}</AlertTitle>
			{description && (
				<AlertDescription className='whitespace-pre-line'>{description}</AlertDescription>
			)}
		</Alert>
	)
}
