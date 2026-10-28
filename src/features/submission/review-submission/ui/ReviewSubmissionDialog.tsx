'use client'

import { useState, useTransition } from 'react'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'
import { Button } from '@/shared/ui/button'
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/shared/ui/dialog'
import { Field, FieldLabel } from '@/shared/ui/field'
import { Textarea } from '@/shared/ui/textarea'
import type { ISubmission } from '@/entities/submission'
import { reviewSubmissionAction, type ReviewDecision } from '../api/reviewSubmissionAction'

export function ReviewSubmissionDialog({ submission }: { submission: ISubmission }) {
	const t = useTranslations('ReviewSubmission')
	const tCommon = useTranslations('Common')
	const [open, setOpen] = useState(false)
	const [comment, setComment] = useState('')
	const [isPending, startTransition] = useTransition()

	const review = (decision: ReviewDecision) =>
		startTransition(async () => {
			const result = await reviewSubmissionAction(submission.id, decision, comment)
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
				<Button size='sm' variant='outline'>
					{t('open')}
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{t('title', { name: submission.studentName })}</DialogTitle>
				</DialogHeader>
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
								{/* TODO(этап 3): ссылка на скачивание через проверку прав на сервере */}
								<ul className='flex flex-col gap-1'>
									{submission.files.map(file => (
										<li key={file.id}>{file.fileName}</li>
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
				</dl>
				<Field>
					<FieldLabel htmlFor='review-comment'>{t('comment')}</FieldLabel>
					<Textarea
						id='review-comment'
						value={comment}
						maxLength={2000}
						placeholder={t('commentPlaceholder')}
						onChange={event => setComment(event.target.value)}
					/>
				</Field>
				<DialogFooter className='gap-2'>
					<Button variant='destructive' disabled={isPending} onClick={() => review('reject')}>
						{t('reject')}
					</Button>
					<Button variant='outline' disabled={isPending} onClick={() => review('request_changes')}>
						{t('requestChanges')}
					</Button>
					<Button disabled={isPending} onClick={() => review('accept')}>
						{t('accept')}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
