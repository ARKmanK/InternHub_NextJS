import { notFound } from 'next/navigation'
import { TaskPage } from '@/pages/task'

export default async function Page({ params }: PageProps<'/tasks/[id]'>) {
	const id = Number((await params).id)
	if (!Number.isInteger(id) || id <= 0) notFound()

	return <TaskPage id={id} />
}
