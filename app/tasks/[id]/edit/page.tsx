import { notFound } from 'next/navigation'
import { TaskEditPage } from '@/pages/task-editor'

export default async function Page({ params }: PageProps<'/tasks/[id]/edit'>) {
	const id = Number((await params).id)
	if (!Number.isInteger(id) || id <= 0) notFound()

	return <TaskEditPage id={id} />
}
