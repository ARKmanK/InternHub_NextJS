'use client'

import { useTransition } from 'react'
import { useTranslations } from 'next-intl'
import { Check, Undo2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/shared/ui/button'
import { ButtonGroup } from '@/shared/ui/button-group'
import { moderateTaskAction, type ModerationDecision } from '../api/moderateTaskAction'

export function ModerationActions({ taskId }: { taskId: number }) {
	const t = useTranslations('TaskModeration')
	const tCommon = useTranslations('Common')
	const [isPending, startTransition] = useTransition()

	const decide = (decision: ModerationDecision) =>
		startTransition(async () => {
			const result = await moderateTaskAction(taskId, decision)
			if (!result.ok) {
				toast.error(tCommon(result.error))
				return
			}
			toast.success(decision === 'approve' ? t('approved') : t('rejected'))
		})

	return (
		<ButtonGroup>
			<Button size='sm' disabled={isPending} onClick={() => decide('approve')}>
				<Check /> {t('approve')}
			</Button>
			<Button size='sm' variant='outline' disabled={isPending} onClick={() => decide('reject')}>
				<Undo2 /> {t('reject')}
			</Button>
		</ButtonGroup>
	)
}
