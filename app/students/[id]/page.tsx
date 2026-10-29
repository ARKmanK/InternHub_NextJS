import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { StudentPortfolioPage } from '@/pages/student-portfolio'

export async function generateMetadata(): Promise<Metadata> {
	const t = await getTranslations('StudentPortfolioPage')
	// Имя студента в заголовок не выносим: заголовки вкладок попадают в историю браузера и логи
	return { title: t('metaTitle'), robots: { index: false } }
}

export default async function Page({ params }: PageProps<'/students/[id]'>) {
	const { id } = await params
	return <StudentPortfolioPage studentId={id} />
}
