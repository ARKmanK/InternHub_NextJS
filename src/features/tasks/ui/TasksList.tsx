import { ITask } from '../types/ITask'
import TaskCard from './TaskCard'
import VerifyTaskCard from './VerifyTaskCard'

type TasksListProps = {
	list: ITask[]
	role?: 'admin' | 'employer' | 'user'
}

export default function TasksList({ list, role }: TasksListProps) {
	return (
		<article className='flex flex-col gap-4'>
			{list.map(task =>
				role === 'admin' ? (
					<VerifyTaskCard key={task.id} data={task} />
				) : role === 'employer' ? (
					<TaskCard key={task.id} data={task} role={'employer'} />
				) : (
					<TaskCard key={task.id} data={task} />
				),
			)}
		</article>
	)
}
