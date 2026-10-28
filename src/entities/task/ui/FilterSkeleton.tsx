import { Card, CardContent, CardFooter } from '@/shared/ui/card'
import { Skeleton } from '@/shared/ui/skeleton'

export function FilterSkeleton() {
	return (
		<Card>
			<CardContent className='flex flex-col gap-3'>
				{Array.from({ length: 4 }, (_, index) => (
					<Skeleton key={index} className='h-9 w-full' />
				))}
			</CardContent>
			<CardFooter>
				<Skeleton className='h-9 flex-1' />
			</CardFooter>
		</Card>
	)
}
