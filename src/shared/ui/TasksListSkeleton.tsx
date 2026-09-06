import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export default function TasksListSkeleton() {
	return (
		<Card>
			<CardHeader>
				<CardTitle className='mt-4'>
					<Skeleton className='h-4 w-70%' />
				</CardTitle>
				<CardDescription>
					<Skeleton className='h-3 w-90%' />
					<Skeleton className='h-3 w-72%' />
					<Skeleton className='h-3 w-87%' />
				</CardDescription>
			</CardHeader>
			<CardContent>
				<Skeleton className='h-3 w-20%' />
				<Skeleton className='h-3 w-17%' />
				<div className='h-10 w-full flex justify-end'>
					<Skeleton className='h-3 w-10%' />
				</div>
			</CardContent>
		</Card>
	)
}
