import TasksList from '@/features/tasks/ui/TasksList'
import { createServerClient } from '@/shared/api/supabaseClient'
import TaskSkeleton from '@/shared/ui/tasks/TaskSkeleton'

export default async function AdminProfileBoard() {
	const supabase = await createServerClient()

	const { data: tasks, error } = await supabase.from('tasks-to-verify').select('*')

	if (!tasks || tasks.length === 0) {
		return (
			<article>
				<p>Панель администратора</p>
				<p className='mt-10'>Ожидающие верификации задачи</p>
				<div className='flex flex-col w-full gap-y-4'>
					{[0, 1, 2].map(_ => (
						<TaskSkeleton />
					))}
				</div>
			</article>
		)
	}

	return (
		<article>
			<p>Панель администратора</p>
			<p className='mt-10'>Ожидающие верификации задачи</p>
			<TasksList list={tasks} role='admin' />
		</article>
	)
}
