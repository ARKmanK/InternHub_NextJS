'use client'

import { useTransition } from 'react'
import { useTranslations } from 'next-intl'
import { XIcon } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/shared/ui/button'
import { removePracticeTaskAction } from '../api/practiceTasksActions'

type RemovePracticeTaskButtonProps = {
	practiceId: number
	taskId: number
	taskTitle: string
}

export function RemovePracticeTaskButton({
	practiceId,
	taskId,
	taskTitle,
}: RemovePracticeTaskButtonProps) {
	const t = useTranslations('ManageTasks')
	const tCommon = useTranslations('Common')
	const [isPending, startTransition] = useTransition()

	const remove = () =>
		startTransition(async () => {
			const result = await removePracticeTaskAction(practiceId, taskId)
			if (!result.ok) toast.error(tCommon(result.error))
		})

	return (
		<Button
			variant='ghost'
			size='icon-xs'
			disabled={isPending}
			aria-label={t('remove', { title: taskTitle })}
			onClick={remove}
		>
			<XIcon />
		</Button>
	)
}
