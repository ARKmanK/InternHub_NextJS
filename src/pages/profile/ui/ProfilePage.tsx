import { getCurrentUser } from '@/entities/user/index.server'
import { AuthPanel } from '@/widgets/auth-panel'
import { AdminDashboard, EmployerDashboard, StudentDashboard } from '@/widgets/profile-dashboards'

/** Роль берётся из сессии на сервере, а не из куки или localStorage, которые может подменить пользователь. */
export async function ProfilePage() {
	const user = await getCurrentUser()

	if (!user) {
		return (
			<div className='flex justify-center py-8'>
				<AuthPanel />
			</div>
		)
	}

	switch (user.role) {
		case 'admin':
			return <AdminDashboard />
		case 'employer':
			return <EmployerDashboard user={user} />
		case 'student':
			return <StudentDashboard user={user} />
	}
}
