import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { MessagesPage } from '@/pages/messages'

export async function generateMetadata(): Promise<Metadata> {
	const t = await getTranslations('MessagesPage')
	return { title: t('metaTitle'), robots: { index: false } }
}

export default function Page() {
	return <MessagesPage />
}
