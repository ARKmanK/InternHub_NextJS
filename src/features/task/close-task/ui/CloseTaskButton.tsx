'use client'

import { useTransition } from 'react'
import { useTranslations } from 'next-intl'
import { Lock } from 'lucide-react'
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
import { closeTaskAction } from '../api/closeTaskAction'

export function CloseTaskButton({ taskId }: { taskId: number }) {
	const t = useTranslations('CloseTask')
	const tCommon = useTranslations('Common')
	const [isPending, startTransition] = useTransition()

	const close = () =>
		startTransition(async () => {
			const result = await closeTaskAction(taskId)
			if (!result.ok) toast.error(tCommon(result.error))
			else toast.success(t('closed'))
		})

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button variant='outline' size='sm' disabled={isPending}>
					<Lock /> {t('close')}
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{t('title')}</DialogTitle>
					<DialogDescription>{t('description')}</DialogDescription>
				</DialogHeader>
				<DialogFooter>
					<DialogClose asChild>
						<Button variant='outline'>{tCommon('cancel')}</Button>
					</DialogClose>
					<DialogClose asChild>
						<Button onClick={close}>{t('close')}</Button>
					</DialogClose>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
