import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import TasksList from '@/features/tasks/ui/TasksList'
import { createServerClient } from '@/shared/api/supabaseClient'
import TaskSkeleton from '@/shared/ui/tasks/TaskSkeleton'
import { Inbox } from 'lucide-react'

export default async function UserProfileBoard() {
	const supabase = await createServerClient()

	const { data: FavTasks, error } = await supabase.from('tasks').select('*') //------------------------Text------------------------//
	const { data: StrtTasks } = await supabase.from('tasks').select('*') //------------------------Text------------------------//
	const { data: ApprTasks } = await supabase.from('tasks').select('*') //------------------------Text------------------------//

	if (!tasks || tasks.length === 0) {
		return (
			//------------------------Text------------------------//
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
			<Tabs defaultValue='favorite'>
				<TabsList>
					<TabsTrigger value='favorite'>Favorite</TabsTrigger>
					<TabsTrigger value='started'>Started</TabsTrigger>
					<TabsTrigger value='approved'>Approved</TabsTrigger>
				</TabsList>
				<TabsContent value='favorite'>
					{!FavTasks ? (
						<div className='rounded-lg bg-[#cee3ff] flex items-center justify-center'>
							<div className='flex flex-col'>
								<Inbox />
								<p>Favorite</p>
								<p>Список пуст</p>
							</div>
						</div>
					) : (
						<TasksList list={FavTasks} role='user' />
					)}
				</TabsContent>
				<TabsContent value='started'>
					{!StrtTasks ? (
						<div className='rounded-lg bg-[#cee3ff] flex items-center justify-center'>
							<div className='flex flex-col'>
								<Inbox />
								<p>Started</p>
								<p>Список пуст</p>
							</div>
						</div>
					) : (
						<TasksList list={StrtTasks} role='user' />
					)}
				</TabsContent>
				<TabsContent value='Approved'>
					{!ApprTasks ? (
						<div className='rounded-lg bg-[#cee3ff] flex items-center justify-center'>
							<div className='flex flex-col'>
								<Inbox />
								<p>Approved</p>
								<p>Список пуст</p>
							</div>
						</div>
					) : (
						<TasksList list={ApprTasks} role='user' />
					)}
				</TabsContent>
			</Tabs>
		</article>
	)
}
