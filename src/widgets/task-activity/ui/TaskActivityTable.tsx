import { getFormatter, getTranslations } from 'next-intl/server'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/ui/table'
import { SubmissionStatusBadge } from '@/entities/submission'
import { getSubmissionsByTask } from '@/entities/submission/index.server'
import { ReviewSubmissionDialog } from '@/features/submission/review-submission'

type TaskActivityTableProps = {
	taskId: number
	/** Колонку «Действие» видит только работодатель — владелец задания. */
	canReview: boolean
}

export async function TaskActivityTable({ taskId, canReview }: TaskActivityTableProps) {
	const t = await getTranslations('TaskActivity')
	const format = await getFormatter()
	const submissions = await getSubmissionsByTask(taskId)
	const columns = canReview ? 4 : 3

	return (
		<section className='flex flex-col gap-3'>
			<h2 className='text-lg font-semibold'>{t('title')}</h2>
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>{t('status')}</TableHead>
						<TableHead>{t('student')}</TableHead>
						<TableHead>{t('date')}</TableHead>
						{canReview && <TableHead className='text-right'>{t('action')}</TableHead>}
					</TableRow>
				</TableHeader>
				<TableBody>
					{submissions.length === 0 ? (
						<TableRow>
							<TableCell colSpan={columns} className='text-center text-muted-foreground'>
								{t('empty')}
							</TableCell>
						</TableRow>
					) : (
						submissions.map(submission => (
							<TableRow key={submission.id}>
								<TableCell>
									<SubmissionStatusBadge status={submission.status} />
								</TableCell>
								<TableCell>{submission.studentName}</TableCell>
								<TableCell>
									{submission.submittedAt
										? format.dateTime(new Date(submission.submittedAt), { dateStyle: 'medium' })
										: '—'}
								</TableCell>
								{canReview && (
									<TableCell className='text-right'>
										<ReviewSubmissionDialog submission={submission} />
									</TableCell>
								)}
							</TableRow>
						))
					)}
				</TableBody>
			</Table>
		</section>
	)
}
