import { notFound } from 'next/navigation'
import { PracticeEditPage } from '@/pages/practice-editor'

export default async function Page({ params }: PageProps<'/practices/[id]/edit'>) {
	const id = Number((await params).id)
	if (!Number.isInteger(id) || id <= 0) notFound()

	return <PracticeEditPage id={id} />
}
