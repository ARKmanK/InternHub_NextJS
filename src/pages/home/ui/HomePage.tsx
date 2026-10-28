import { getTranslations } from 'next-intl/server'
import { parseTaskFilters, type TaskSearchParams } from '@/entities/task'
import { TasksBoard } from '@/widgets/tasks-feed'

export async function HomePage({ searchParams }: { searchParams: TaskSearchParams }) {
	const t = await getTranslations('HomePage')
	const filters = parseTaskFilters(searchParams)

	return (
		<div className='flex flex-col gap-6'>
			<div className='flex flex-col gap-1'>
				<h1 className='text-3xl font-semibold'>{t('title')}</h1>
				<p className='text-muted-foreground'>{t('subtitle')}</p>
			</div>
			<TasksBoard filters={filters} />
		</div>
	)
}
