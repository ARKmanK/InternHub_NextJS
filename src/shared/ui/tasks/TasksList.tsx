import { ITask } from '@/entities/task/model/ITask'
import TaskCard from '@/entities/task/ui/TaskCard'
import TaskDeleteForm from '@/features/task/ui/TaskDeleteForm'
import TaskEditForm from '@/features/task/ui/TaskEditForm'
import VerifyTaskCard from '@/features/task/ui/VerifyTaskCard'

type TasksListProps = {
	list: ITask[]
	role?: string
}

export default function TasksList({ list, role }: TasksListProps) {
	return (
		<article className='flex flex-col gap-4'>
			{list.map(task =>
				role === 'admin' ? (
					<VerifyTaskCard key={task.id} data={task} />
				) : role === 'employer' ? (
					<TaskCard
						key={task.id}
						data={task}
						onEdit={<TaskEditForm taskId={1} />}
						onDelete={<TaskDeleteForm taskId={1} />}
					/>
				) : (
					<TaskCard key={task.id} data={task} onFavorite={<TaskEditForm taskId={1} />} />
				),
			)}
		</article>
	)
}
