import TaskCard from '@/entities/task/ui/TaskCard'
import { createServerClient } from '@/shared/api/supabaseClient'
import TaskSkeleton from '@/shared/ui/tasks/TaskSkeleton'

type TaskProfilePageProps = {
	pageId: number
}

export default async function TaskProfilePage({ pageId }: TaskProfilePageProps) {
	const supabase = await createServerClient()

	const { data: task, error } = await supabase.from('tasks').select(`*`).eq('id', pageId).single()

	if (!task || error) {
		return <TaskSkeleton />
	}

	return (
		<article>
			<h1>Страница задачи</h1>
			<TaskCard data={task} />
		</article>
	)
}
