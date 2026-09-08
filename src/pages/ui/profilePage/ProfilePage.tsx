import LoginForm from '@/features/auth/ui/LoginForm'
import { cookies } from 'next/headers'
import AdminProfile from './admin/AdminProfile'
import EmployerProfile from './employer/EmployerProfile'
import UserProfile from './user/UserProfile'

export default async function ProfilePage() {
	const cookieStore = await cookies()
	const token = cookieStore.get('auth_token')?.value
	const role = cookieStore.get('role')?.value

	await new Promise(resolve => setTimeout(resolve, 2000))

	if (!token) {
		return <LoginForm />
	}

	return (
		<>
			{role === 'admin' ? (
				<AdminProfile />
			) : role === 'employer' ? (
				<EmployerProfile />
			) : (
				<UserProfile />
			)}
		</>
	)
}
