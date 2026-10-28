import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { TaskPage, getTaskPageTitle } from '@/pages/task'

const parseId = (raw: string) => {
	const id = Number(raw)
	return Number.isInteger(id) && id > 0 ? id : null
}

export async function generateMetadata({ params }: PageProps<'/tasks/[id]'>): Promise<Metadata> {
	const id = parseId((await params).id)
	const title = id ? await getTaskPageTitle(id) : null
	return title ? { title } : {}
}

export default async function Page({ params }: PageProps<'/tasks/[id]'>) {
	const id = parseId((await params).id)
	if (!id) notFound()

	return <TaskPage id={id} />
}
