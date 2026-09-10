import { Button } from '@/components/ui/button'
import { ButtonGroup } from '@/components/ui/button-group'
import { Field } from '@/components/ui/field'
import Notifications from '@/features/notification/ui/Notifications'
import ThemeToggler from '@/features/theme/ui/ThemeToggler'
import { ArrowLeftIcon, User2 } from 'lucide-react'

export default function UtilityBar() {
	return (
		<div className='w-[70%] flex justify-end'>
			<ButtonGroup>
				<ButtonGroup>
					<Button variant='outline' size='icon'>
						<ArrowLeftIcon />
					</Button>
				</ButtonGroup>
				<ButtonGroup>
					<Button variant='outline'>Import</Button>
					<Field orientation={'horizontal'}>
						<User2 />
						<Button variant='outline'>Profile</Button>
					</Field>
					<Notifications />
					<ThemeToggler />
				</ButtonGroup>
			</ButtonGroup>
		</div>
	)
}
