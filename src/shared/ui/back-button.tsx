'use client'

import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { Button } from './button'

export function BackButton() {
	const router = useRouter()
	const t = useTranslations('Common')

	return (
		<Button variant='ghost' onClick={() => router.back()}>
			<ArrowLeft /> {t('back')}
		</Button>
	)
}
