import TasksList from '@/features/tasks/ui/TasksList'
import { createServerClient } from '@/shared/api/supabaseClient'
import TasksListSkeleton from '@/shared/ui/TasksListSkeleton'

export default async function ProfileBoard() {
	const supabase = await createServerClient()

	const { data: tasks, error } = await supabase.from('tasks').select('*')

	if (!tasks || tasks.length === 0) {
		return <TasksListSkeleton />
	}

	return (
		<article>
			<h1>Страница профиля</h1>
			<p className='mt-10'>Мои задачи</p>
			<TasksList list={tasks} />
		</article>
	)
}
