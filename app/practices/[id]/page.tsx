import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { PracticePage } from '@/pages/practice'

export async function generateMetadata(): Promise<Metadata> {
	const t = await getTranslations('PracticePage')
	return { title: t('metaTitle'), robots: { index: false } }
}

export default async function Page({ params }: PageProps<'/practices/[id]'>) {
	const id = Number((await params).id)
	if (!Number.isInteger(id) || id <= 0) notFound()

	return <PracticePage id={id} />
}
