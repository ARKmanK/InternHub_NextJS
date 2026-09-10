import { Button } from '@/components/ui/button'
import { ArrowUp } from 'lucide-react'

export default function GoUpButton() {
	return (
		<Button className='fixed  right-20 bottom-40'>
			<a href='#'>
				<ArrowUp />
			</a>
		</Button>
	)
}
