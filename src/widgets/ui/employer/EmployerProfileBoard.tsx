import TasksList from '@/shared/ui/tasks/TasksList'
import { createServerClient } from '@/shared/api/supabaseClient'
import TaskSkeleton from '@/shared/ui/tasks/TaskSkeleton'

export default async function EmployerProfileBoard() {
	const supabase = await createServerClient()

	const { data: tasks, error } = await supabase.from('tasks').select('*') //------------------------Text------------------------//

	if (!tasks || tasks.length === 0) {
		return (
			<article>
				<h1>Страница профиля</h1>
				<p className='mt-10'>Мои задачи</p>
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
			<h1>Страница профиля</h1>
			<p className='mt-10'>Мои задачи</p>
			<TasksList list={tasks} role='employer' />
		</article>
	)
}
