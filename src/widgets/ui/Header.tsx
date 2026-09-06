import { Field, FieldTitle } from '@/components/ui/field'
import { User } from 'lucide-react'
import Link from 'next/link'

export default function Header() {
	return (
		<header className='min-[1200px]:h-30 min-[1200px]:w-screen bg-gray-600 flex justify-end'>
			<Field>
				<FieldTitle>Профиль</FieldTitle>
				<Link href='/profile'>
					<User />
				</Link>
			</Field>
		</header>
	)
}
