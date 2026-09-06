import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { MessageCircle } from 'lucide-react'

export default function SupportChat() {
	return (
		<div className='fixed bottom-30 right-4'>
			<Popover>
				<PopoverTrigger>
					<Button variant='outline' className='rounded-full'>
						<MessageCircle />
					</Button>
				</PopoverTrigger>
				<PopoverContent className='w-80 h-120'></PopoverContent>
			</Popover>
		</div>
	)
}
