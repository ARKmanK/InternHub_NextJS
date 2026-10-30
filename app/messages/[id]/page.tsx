import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { MessagesPage } from '@/pages/messages'

export async function generateMetadata(): Promise<Metadata> {
	const t = await getTranslations('MessagesPage')
	// Имя собеседника в заголовок не выносим: заголовки вкладок попадают в историю браузера
	return { title: t('metaTitle'), robots: { index: false } }
}

export default async function Page({ params }: PageProps<'/messages/[id]'>) {
	const id = Number((await params).id)
	if (!Number.isInteger(id) || id <= 0) notFound()

	return <MessagesPage conversationId={id} />
}
