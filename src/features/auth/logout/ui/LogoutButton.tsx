'use client'

import { useTransition } from 'react'
import { useTranslations } from 'next-intl'
import { LogOut } from 'lucide-react'
import { Button } from '@/shared/ui/button'
import { logoutAction } from '../api/logoutAction'

export function LogoutButton() {
	const t = useTranslations('LogoutButton')
	const [isPending, startTransition] = useTransition()

	return (
		<Button
			variant='ghost'
			size='icon'
			aria-label={t('logout')}
			title={t('logout')}
			disabled={isPending}
			onClick={() => startTransition(() => logoutAction())}
		>
			<LogOut />
		</Button>
	)
}
