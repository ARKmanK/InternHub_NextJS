import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { Award } from 'lucide-react'
import { BackButton } from '@/shared/ui/back-button'
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle } from '@/shared/ui/empty'
import { PortfolioCard } from '@/entities/submission'
import { getPortfolio } from '@/entities/submission/index.server'
import { getCurrentUser, getStudentProfile } from '@/entities/user/index.server'

/**
 * Портфолио студента: принятые решения с оценками и отзывами.
 * Это персональные данные (152-ФЗ), поэтому страница не публичная: её видят сам студент,
 * работодатели (для отбора кандидатов) и администратор. Остальным — 404.
 */
export async function StudentPortfolioPage({ studentId }: { studentId: string }) {
	const viewer = await getCurrentUser()
	const canView =
		viewer &&
		(viewer.id === studentId ||
			viewer.role === 'employer' ||
			viewer.role === 'teacher' ||
			viewer.role === 'admin')
	if (!canView) notFound()

	const student = await getStudentProfile(studentId)
	if (!student) notFound()

	const t = await getTranslations('StudentPortfolioPage')
	const items = await getPortfolio(studentId)
	const scores = items.flatMap(item => (item.score === null ? [] : [item.score]))
	const averageScore = scores.length
		? (scores.reduce((sum, score) => sum + score, 0) / scores.length).toFixed(1)
		: null

	return (
		<div className='flex flex-col gap-6'>
			<div>
				<BackButton />
			</div>
			<header className='flex flex-col gap-1'>
				<h1 className='text-2xl font-semibold'>{student.name}</h1>
				<p className='text-muted-foreground'>
					{t('groupCourse', { group: student.group, course: student.course })}
				</p>
				<p className='text-sm'>
					{t('summary', { count: items.length })}
					{averageScore && ` · ${t('averageScore', { score: averageScore })}`}
				</p>
			</header>
			{items.length === 0 ? (
				<Empty className='border border-dashed'>
					<EmptyHeader>
						<EmptyMedia variant='icon'>
							<Award />
						</EmptyMedia>
						<EmptyTitle>{t('empty')}</EmptyTitle>
					</EmptyHeader>
				</Empty>
			) : (
				<div className='grid gap-4 md:grid-cols-2'>
					{items.map(item => (
						<PortfolioCard key={item.submissionId} item={item} />
					))}
				</div>
			)}
		</div>
	)
}
