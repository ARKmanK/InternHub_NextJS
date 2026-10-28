'use client'

import { useState, useTransition } from 'react'
import { useTranslations } from 'next-intl'
import { Trash2 } from 'lucide-react'
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
import { Input } from '@/shared/ui/input'
import { Spinner } from '@/shared/ui/spinner'
import { deleteTaskAction } from '../api/deleteTaskAction'
import { getRequiredTitlePart } from '../lib/getRequiredTitlePart'

type TaskDeleteDialogProps = {
	taskId: number
	taskTitle: string
}

export function TaskDeleteDialog({ taskId, taskTitle }: TaskDeleteDialogProps) {
	const t = useTranslations('TaskDelete')
	const tCommon = useTranslations('Common')
	const [open, setOpen] = useState(false)
	const [confirmText, setConfirmText] = useState('')
	const [isPending, startTransition] = useTransition()

	const phrase = getRequiredTitlePart(taskTitle)
	const isConfirmed = confirmText.trim().toLowerCase() === phrase.toLowerCase()

	const handleOpenChange = (value: boolean) => {
		setOpen(value)
		if (!value) setConfirmText('')
	}

	const handleDelete = () =>
		startTransition(async () => {
			const result = await deleteTaskAction(taskId)
			if (!result.ok) {
				toast.error(tCommon(result.error))
				return
			}
			toast.success(t('deleted'))
			handleOpenChange(false)
		})

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			<DialogTrigger asChild>
				<Button variant='ghost' size='icon' aria-label={t('deleteTask')}>
					<Trash2 />
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{t('title')}</DialogTitle>
					<DialogDescription>{t('description', { phrase })}</DialogDescription>
				</DialogHeader>
				<Input
					value={confirmText}
					onChange={event => setConfirmText(event.target.value)}
					autoComplete='off'
					aria-label={phrase}
				/>
				<DialogFooter>
					<DialogClose asChild>
						<Button variant='outline'>{t('cancel')}</Button>
					</DialogClose>
					<Button variant='destructive' disabled={!isConfirmed || isPending} onClick={handleDelete}>
						{isPending && <Spinner />} {t('delete')}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
