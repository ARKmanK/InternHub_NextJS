import type { ReactNode } from 'react'
import { Badge } from '@/shared/ui/badge'

type TagProps = {
	label: string
	action?: ReactNode
}

export function Tag({ label, action }: TagProps) {
	return (
		<Badge variant='secondary' className='gap-1'>
			{label}
			{action}
		</Badge>
	)
}
