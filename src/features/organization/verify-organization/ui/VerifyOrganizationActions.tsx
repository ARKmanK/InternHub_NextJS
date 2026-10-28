'use client'

import { useTransition } from 'react'
import { useTranslations } from 'next-intl'
import { Check, X } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/shared/ui/button'
import { ButtonGroup } from '@/shared/ui/button-group'
import {
	verifyOrganizationAction,
	type VerificationDecision,
} from '../api/verifyOrganizationAction'

export function VerifyOrganizationActions({ organizationId }: { organizationId: number }) {
	const t = useTranslations('VerifyOrganization')
	const tCommon = useTranslations('Common')
	const [isPending, startTransition] = useTransition()

	const decide = (decision: VerificationDecision) =>
		startTransition(async () => {
			const result = await verifyOrganizationAction(organizationId, decision)
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
				<X /> {t('reject')}
			</Button>
		</ButtonGroup>
	)
}
