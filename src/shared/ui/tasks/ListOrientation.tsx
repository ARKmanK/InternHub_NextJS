import { Button } from '@/components/ui/button'
import { ButtonGroup } from '@/components/ui/button-group'
import { Field } from '@/components/ui/field'
import { Grid, List } from 'lucide-react'

export default function ListOrientation() {
	return (
		<div className='w-[70%] flex justify-end'>
			<ButtonGroup>
				<ButtonGroup>
					<Button variant='outline' size='icon'>
						<List />
					</Button>
				</ButtonGroup>
				<ButtonGroup>
					<Button variant='outline'>Import</Button>
					<Field orientation={'horizontal'}>
						<Grid />
						<Button variant='outline'>Profile</Button>
					</Field>
				</ButtonGroup>
			</ButtonGroup>
		</div>
	)
}
