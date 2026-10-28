'use client'

import { useTransition } from 'react'
import { useTranslations } from 'next-intl'
import { Check, X } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/shared/ui/button'
import { ButtonGroup } from '@/shared/ui/button-group'
import { reviewApplicationAction, type ApplicationDecision } from '../api/reviewApplicationAction'

export function ReviewApplicationActions({ applicationId }: { applicationId: number }) {
	const t = useTranslations('ReviewApplication')
	const tCommon = useTranslations('Common')
	const [isPending, startTransition] = useTransition()

	const decide = (decision: ApplicationDecision) =>
		startTransition(async () => {
			const result = await reviewApplicationAction(applicationId, decision)
			if (!result.ok) toast.error(tCommon(result.error))
			else toast.success(decision === 'accept' ? t('accepted') : t('declined'))
		})

	return (
		<ButtonGroup>
			<Button size='sm' disabled={isPending} onClick={() => decide('accept')}>
				<Check /> {t('accept')}
			</Button>
			<Button size='sm' variant='outline' disabled={isPending} onClick={() => decide('decline')}>
				<X /> {t('decline')}
			</Button>
		</ButtonGroup>
	)
}
