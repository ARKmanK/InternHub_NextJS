import TasksFilter from '@/features/task/ui/TasksFilter'
import FilterSkeleton from '@/entities/task/ui/FilterSkeleton'
import TaskSkeleton from '@/shared/ui/tasks/TaskSkeleton'
import { memo } from 'react'
import { createServerSupabaseClient } from '@/features/api/supabase/server'
import TaskBoardClient from '../../features/task/ui/TaskBoardClient'

async function TasksBoard() {
	const supabase = await createServerSupabaseClient()

	const { data: tasks, error } = await supabase.from('tasks').select('*').range(0, 19)

	if (!tasks || tasks.length === 0) {
		return (
			<article className='min-[1200px]:h-30 min-[1200px]:w-screen'>
				<div className='flex justify-between'>
					<FilterSkeleton />
					{[0, 1, 2, 3].map((_, index) => (
						<TaskSkeleton key={index} />
					))}
				</div>
			</article>
		)
	}

	if (error) {
		return (
			<article className='min-[1200px]:h-30 min-[1200px]:w-screen flex justify-center items-center text-[60px]'>
				No Data
			</article>
		)
	}

	return (
		<article className='min-[1200px]:h-30 min-[1200px]:w-screen'>
			<div className='flex justify-between'>
				<TasksFilter />
				<TaskBoardClient data={tasks || []} />
			</div>
		</article>
	)
}

export default memo(TasksBoard)
