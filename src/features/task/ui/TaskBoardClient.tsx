'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import TasksList from '@/shared/ui/tasks/TasksList'
import TaskSkeleton from '@/shared/ui/tasks/TaskSkeleton'
import { ITask } from '@/entities/task/model/ITask'
import { createSupabaseClient } from '@/features/api/supabase/client'

type TaskBoardClientProps = {
	data: ITask[]
}

export default function TaskBoardClient({ data }: TaskBoardClientProps) {
	const [tasks, setTasks] = useState(data)
	const [isLoading, setIsLoading] = useState(false)
	const [hasMore, setHasMore] = useState(data.length === 10)

	const loadMore = async () => {
		setIsLoading(true)
		const supabase = createSupabaseClient()

		const { data: newTasks } = await supabase
			.from('tasks')
			.select('*')
			.range(tasks.length, tasks.length + 9)

		if (newTasks && newTasks.length > 0) {
			setTasks(prev => [...prev, ...newTasks])
			setHasMore(newTasks.length === 10)
		} else {
			setHasMore(false)
		}
		setIsLoading(false)
	}

	return (
		<div>
			<TasksList list={tasks} />
			{isLoading && <TaskSkeleton />}
			{hasMore && (
				<Button onClick={loadMore} disabled={isLoading}>
					{isLoading ? 'Загрузка...' : 'Показать еще'}
				</Button>
			)}
		</div>
	)
}
