import { Card, CardContent, CardHeader } from '@/shared/ui/card'
import { Skeleton } from '@/shared/ui/skeleton'

export function TaskSkeleton() {
	return (
		<Card>
			<CardHeader className='gap-2'>
				<Skeleton className='h-5 w-2/3' />
				<Skeleton className='h-4 w-1/4' />
			</CardHeader>
			<CardContent className='flex flex-col gap-2'>
				<Skeleton className='h-3 w-11/12' />
				<Skeleton className='h-3 w-3/4' />
				<Skeleton className='h-3 w-5/6' />
				<Skeleton className='mt-2 h-3 w-1/5' />
			</CardContent>
		</Card>
	)
}

export function TaskListSkeleton({ count = 3 }: { count?: number }) {
	return (
		<div className='flex flex-col gap-4'>
			{Array.from({ length: count }, (_, index) => (
				<TaskSkeleton key={index} />
			))}
		</div>
	)
}
