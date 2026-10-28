import { Inbox } from 'lucide-react'
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle } from '@/shared/ui/empty'

export function EmptyList({ title }: { title: string }) {
	return (
		<Empty className='border border-dashed'>
			<EmptyHeader>
				<EmptyMedia variant='icon'>
					<Inbox />
				</EmptyMedia>
				<EmptyTitle>{title}</EmptyTitle>
			</EmptyHeader>
		</Empty>
	)
}
