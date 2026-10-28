import { Skeleton } from '@/shared/ui/skeleton'

export function NotificationSkeleton() {
	return (
		<div className='flex items-center gap-4'>
			<Skeleton className='size-10 rounded-full' />
			<div className='flex flex-1 flex-col gap-2'>
				<Skeleton className='h-4 w-3/4' />
				<Skeleton className='h-4 w-1/2' />
			</div>
		</div>
	)
}
