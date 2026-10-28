'use client'

import { useState, useTransition } from 'react'
import { useTranslations } from 'next-intl'
import { Check, Undo2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/shared/ui/button'
import { ButtonGroup } from '@/shared/ui/button-group'
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/shared/ui/dialog'
import { Field, FieldLabel } from '@/shared/ui/field'
import { Textarea } from '@/shared/ui/textarea'
import { moderateTaskAction, type ModerationDecision } from '../api/moderateTaskAction'

const MIN_REASON_LENGTH = 5

export function ModerationActions({ taskId }: { taskId: number }) {
	const t = useTranslations('TaskModeration')
	const tCommon = useTranslations('Common')
	const [isPending, startTransition] = useTransition()
	const [isRejectOpen, setRejectOpen] = useState(false)
	const [reason, setReason] = useState('')

	const decide = (decision: ModerationDecision, comment?: string) =>
		startTransition(async () => {
			const result = await moderateTaskAction(taskId, decision, comment)
			if (!result.ok) {
				toast.error(tCommon(result.error))
				return
			}
			toast.success(decision === 'approve' ? t('approved') : t('rejected'))
			setRejectOpen(false)
			setReason('')
		})

	return (
		<ButtonGroup>
			<Button size='sm' disabled={isPending} onClick={() => decide('approve')}>
				<Check /> {t('approve')}
			</Button>
			<Dialog open={isRejectOpen} onOpenChange={setRejectOpen}>
				<DialogTrigger asChild>
					<Button size='sm' variant='outline' disabled={isPending}>
						<Undo2 /> {t('reject')}
					</Button>
				</DialogTrigger>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>{t('rejectTitle')}</DialogTitle>
						<DialogDescription>{t('rejectDescription')}</DialogDescription>
					</DialogHeader>
					<Field>
						<FieldLabel htmlFor={`moderation-reason-${taskId}`}>{t('reason')}</FieldLabel>
						<Textarea
							id={`moderation-reason-${taskId}`}
							value={reason}
							maxLength={2000}
							onChange={event => setReason(event.target.value)}
						/>
					</Field>
					<DialogFooter>
						<DialogClose asChild>
							<Button variant='outline'>{tCommon('cancel')}</Button>
						</DialogClose>
						<Button
							disabled={isPending || reason.trim().length < MIN_REASON_LENGTH}
							onClick={() => decide('reject', reason)}
						>
							{t('reject')}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</ButtonGroup>
	)
}
