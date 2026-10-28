import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { HomePage } from '@/pages/home'

export async function generateMetadata(): Promise<Metadata> {
	const t = await getTranslations('HomePage')
	return { title: t('metaTitle') }
}

export default async function Page({ searchParams }: PageProps<'/'>) {
	return <HomePage searchParams={await searchParams} />
}
