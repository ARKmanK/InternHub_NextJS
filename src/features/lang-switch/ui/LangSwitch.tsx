'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'
import { Languages } from 'lucide-react'
import { locales } from '@/shared/i18n'
import { Button } from '@/shared/ui/button'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu'
import { setLocaleAction } from '../api/setLocaleAction'

export function LangSwitch() {
	const t = useTranslations('LangSwitch')
	const locale = useLocale()
	const router = useRouter()
	const [isPending, startTransition] = useTransition()

	const handleChange = (value: string) =>
		startTransition(async () => {
			await setLocaleAction(value)
			router.refresh()
		})

	return (
		<DropdownMenu modal={false}>
			<DropdownMenuTrigger asChild>
				<Button variant='outline' size='icon' aria-label={t('label')} disabled={isPending}>
					<Languages />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align='end'>
				<DropdownMenuRadioGroup value={locale} onValueChange={handleChange}>
					{locales.map(item => (
						<DropdownMenuRadioItem key={item} value={item}>
							{t(item)}
						</DropdownMenuRadioItem>
					))}
				</DropdownMenuRadioGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
