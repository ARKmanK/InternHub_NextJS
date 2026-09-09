import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export default function FilterSkeleton() {
	return (
		<Card>
			<CardContent className='flex flex-col'>
				<Skeleton className='w-20 h-6' />
				<Skeleton className='w-20 h-6' />
				<Skeleton className='w-20 h-6' />
				<Skeleton className='w-20 h-6' />
			</CardContent>
			<CardFooter>
				<Skeleton className='h-12 flex-1' />
			</CardFooter>
		</Card>
	)
}
