import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { Plus } from 'lucide-react'
import { routes } from '@/shared/config'
import { Button } from '@/shared/ui/button'
import { PracticeCard } from '@/entities/practice'
import { getTeacherPractices } from '@/entities/practice/index.server'
import type { IUser } from '@/entities/user'
import { EmptyList } from './EmptyList'

export async function TeacherDashboard({ user }: { user: IUser }) {
	const t = await getTranslations('ProfileDashboards')
	const practices = await getTeacherPractices(user.id)

	return (
		<section className='flex flex-col gap-4'>
			<div className='flex flex-wrap items-center justify-between gap-4'>
				<h1 className='text-2xl font-semibold'>{t('teacherTitle')}</h1>
				<Button asChild>
					<Link href={routes.practiceCreate()}>
						<Plus /> {t('createPractice')}
					</Link>
				</Button>
			</div>
			{practices.length === 0 ? (
				<EmptyList title={t('noPractices')} />
			) : (
				practices.map(practice => (
					<PracticeCard key={practice.id} practice={practice} href={routes.practice(practice.id)} />
				))
			)}
		</section>
	)
}
