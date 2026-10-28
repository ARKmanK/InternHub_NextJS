'use client'

import { useState, useTransition } from 'react'
import { useTranslations } from 'next-intl'
import { Star } from 'lucide-react'
import { toast } from 'sonner'
import { routes } from '@/shared/config'
import { Button } from '@/shared/ui/button'
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/shared/ui/dialog'
import { Field, FieldDescription, FieldLabel } from '@/shared/ui/field'
import { Textarea } from '@/shared/ui/textarea'
import { SubmissionStatusBadge, type ISubmission } from '@/entities/submission'
import { reviewSubmissionAction, type ReviewDecision } from '../api/reviewSubmissionAction'

const SCORES = [1, 2, 3, 4, 5] as const
const MIN_COMMENT_LENGTH = 5

/** Просмотр решения и проверка. Кнопки решения — только пока решение «на проверке». */
export function ReviewSubmissionDialog({ submission }: { submission: ISubmission }) {
	const t = useTranslations('ReviewSubmission')
	const tCommon = useTranslations('Common')
	const [open, setOpen] = useState(false)
	const [comment, setComment] = useState('')
	const [score, setScore] = useState<number | null>(null)
	const [isPending, startTransition] = useTransition()

	const canReview = submission.status === 'submitted'
	const hasComment = comment.trim().length >= MIN_COMMENT_LENGTH

	const review = (decision: ReviewDecision) =>
		startTransition(async () => {
			const result = await reviewSubmissionAction(submission.id, decision, comment, score)
			if (!result.ok) {
				toast.error(tCommon(result.error))
				return
			}
			toast.success(t('done'))
			setOpen(false)
		})

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button size='sm' variant={canReview ? 'default' : 'outline'}>
					{canReview ? t('open') : t('view')}
				</Button>
			</DialogTrigger>
			<DialogContent className='max-h-[90vh] overflow-y-auto'>
				<DialogHeader>
					<DialogTitle>{t('title', { name: submission.studentName })}</DialogTitle>
				</DialogHeader>
				<SubmissionStatusBadge status={submission.status} />
				<dl className='grid grid-cols-[auto_1fr] gap-x-3 gap-y-2 text-sm'>
					{submission.repositoryUrl && (
						<>
							<dt className='text-muted-foreground'>{t('repository')}</dt>
							<dd className='truncate'>
								<a
									href={submission.repositoryUrl}
									target='_blank'
									rel='noreferrer noopener'
									className='underline'
								>
									{submission.repositoryUrl}
								</a>
							</dd>
						</>
					)}
					{submission.files.length > 0 && (
						<>
							<dt className='text-muted-foreground'>{t('files')}</dt>
							<dd>
								<ul className='flex flex-col gap-1'>
									{submission.files.map(file => (
										<li key={file.id}>
											<a href={routes.submissionFile(file.id)} className='underline'>
												{file.fileName}
											</a>
										</li>
									))}
								</ul>
							</dd>
						</>
					)}
					{submission.comment && (
						<>
							<dt className='text-muted-foreground'>{t('studentComment')}</dt>
							<dd className='whitespace-pre-line'>{submission.comment}</dd>
						</>
					)}
					{submission.score !== null && (
						<>
							<dt className='text-muted-foreground'>{t('score')}</dt>
							<dd>{submission.score} / 5</dd>
						</>
					)}
					{submission.reviewComment && (
						<>
							<dt className='text-muted-foreground'>{t('reviewComment')}</dt>
							<dd className='whitespace-pre-line'>{submission.reviewComment}</dd>
						</>
					)}
				</dl>

				{canReview && (
					<>
						<Field>
							<FieldLabel>{t('score')}</FieldLabel>
							<div className='flex gap-1' role='radiogroup' aria-label={t('score')}>
								{SCORES.map(value => (
									<Button
										key={value}
										type='button'
										variant='ghost'
										size='icon'
										role='radio'
										aria-checked={score === value}
										aria-label={`${value}`}
										onClick={() => setScore(value)}
									>
										<Star
											className='size-5'
											fill={score !== null && value <= score ? 'currentColor' : 'none'}
										/>
									</Button>
								))}
							</div>
							<FieldDescription>{t('scoreHint')}</FieldDescription>
						</Field>
						<Field>
							<FieldLabel htmlFor={`review-comment-${submission.id}`}>{t('comment')}</FieldLabel>
							<Textarea
								id={`review-comment-${submission.id}`}
								value={comment}
								maxLength={2000}
								placeholder={t('commentPlaceholder')}
								onChange={event => setComment(event.target.value)}
							/>
							<FieldDescription>{t('commentHint')}</FieldDescription>
						</Field>
						<DialogFooter className='gap-2'>
							<Button
								variant='destructive'
								disabled={isPending || !hasComment}
								onClick={() => review('reject')}
							>
								{t('reject')}
							</Button>
							<Button
								variant='outline'
								disabled={isPending || !hasComment}
								onClick={() => review('request_changes')}
							>
								{t('requestChanges')}
							</Button>
							<Button disabled={isPending || score === null} onClick={() => review('accept')}>
								{t('accept')}
							</Button>
						</DialogFooter>
					</>
				)}
			</DialogContent>
		</Dialog>
	)
}
