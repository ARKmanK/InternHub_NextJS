'use client'

import { useTheme } from 'next-themes'
import { Moon, Sun } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Button } from '@/shared/ui/button'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu'

const themes = ['light', 'dark', 'system'] as const

export function ThemeToggle() {
	const { setTheme } = useTheme()
	const t = useTranslations('ThemeToggle')

	return (
		<DropdownMenu modal={false}>
			<DropdownMenuTrigger asChild>
				<Button variant='outline' size='icon' aria-label={t('label')}>
					<Sun className='scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90' />
					<Moon className='absolute scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0' />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align='end'>
				{themes.map(theme => (
					<DropdownMenuItem key={theme} onClick={() => setTheme(theme)}>
						{t(theme)}
					</DropdownMenuItem>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
