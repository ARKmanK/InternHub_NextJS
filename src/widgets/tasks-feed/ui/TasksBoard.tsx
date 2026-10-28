import type { TaskFilters } from '@/entities/task'
import { getTaskFilterOptions, getTasks } from '@/entities/task/index.server'
import { getCurrentUser } from '@/entities/user/index.server'
import { TaskFiltersPanel } from '@/features/task/task-filters'
import { TasksFeed } from './TasksFeed'

/** Лента задач с фильтрами. Первая страница рендерится на сервере, следующие догружаются. */
export async function TasksBoard({ filters }: { filters: TaskFilters }) {
	const user = await getCurrentUser()
	const [initialPage, options] = await Promise.all([
		getTasks(filters, 0, user),
		getTaskFilterOptions(),
	])

	return (
		<div className='grid gap-6 lg:grid-cols-[280px_1fr]'>
			<aside>
				<TaskFiltersPanel filters={filters} options={options} />
			</aside>
			<TasksFeed
				// Новый набор фильтров — новый список: key сбрасывает догруженные страницы
				key={JSON.stringify(filters)}
				initialPage={initialPage}
				filters={filters}
				viewer={user && { id: user.id, role: user.role }}
			/>
		</div>
	)
}
