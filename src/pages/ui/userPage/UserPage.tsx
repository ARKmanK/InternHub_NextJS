import LoginForm from '@/features/auth/ui/LoginForm'
import UtilityBar from '@/shared/ui/UtilityBar'
import Footer from '@/widgets/ui/Footer'
import Header from '@/widgets/ui/Header'
import ProfileBoard from '@/widgets/ui/ProfileBoard'
import { cookies } from 'next/headers'

export default async function UserPage() {
	const cookieStore = await cookies()
	const token = cookieStore.get('auth_token')?.value

	await new Promise(resolve => setTimeout(resolve, 2000))

	if (!token) {
		return <LoginForm />
	}

	return (
		<main className='min-h-screen min-w-screen'>
			<Header />
			<UtilityBar />
			<ProfileBoard />
			<Footer />
		</main>
	)
}
