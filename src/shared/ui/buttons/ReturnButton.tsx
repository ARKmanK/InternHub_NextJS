'use client'

import { Button } from '@/components/ui/button'
import { LucideArrowLeft } from 'lucide-react'
import { useRouter } from 'next/router'

export default function ReturnButton() {
	const router = useRouter()

	return (
		<Button onClick={() => router.back()}>
			<LucideArrowLeft /> Назад
		</Button>
	)
}
