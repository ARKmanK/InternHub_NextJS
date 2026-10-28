'use client'

import { useState, useTransition } from 'react'
import { useTranslations } from 'next-intl'
import { Send } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/shared/ui/button'
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
import { Spinner } from '@/shared/ui/spinner'
import { Textarea } from '@/shared/ui/textarea'
import { applyToTaskAction } from '../api/applyToTaskAction'

export function ApplyToTaskButton({ taskId }: { taskId: number }) {
	const t = useTranslations('ApplyToTask')
	const tCommon = useTranslations('Common')
	const [open, setOpen] = useState(false)
	const [message, setMessage] = useState('')
	const [isPending, startTransition] = useTransition()

	const apply = () =>
		startTransition(async () => {
			const result = await applyToTaskAction(taskId, message)
			if (!result.ok) {
				toast.error(tCommon(result.error))
				return
			}
			toast.success(t('sent'))
			setOpen(false)
		})

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button>
					<Send /> {t('apply')}
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{t('title')}</DialogTitle>
					<DialogDescription>{t('description')}</DialogDescription>
				</DialogHeader>
				<Field>
					<FieldLabel htmlFor={`apply-message-${taskId}`}>{t('message')}</FieldLabel>
					<Textarea
						id={`apply-message-${taskId}`}
						value={message}
						maxLength={1000}
						placeholder={t('messagePlaceholder')}
						onChange={event => setMessage(event.target.value)}
					/>
				</Field>
				<DialogFooter>
					<DialogClose asChild>
						<Button variant='outline'>{tCommon('cancel')}</Button>
					</DialogClose>
					<Button disabled={isPending} onClick={apply}>
						{isPending && <Spinner />} {t('send')}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
