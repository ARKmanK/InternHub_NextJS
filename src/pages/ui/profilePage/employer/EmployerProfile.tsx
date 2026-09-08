import UtilityBar from '@/shared/ui/tasks/UtilityBar'
import EmployerProfileBoard from '@/widgets/ui/employer/EmployerProfileBoard'
import Footer from '@/widgets/ui/Footer'
import Header from '@/widgets/ui/Header'
import UserProfileBoard from '@/widgets/ui/user/UserProfileBoard'

export default function EmployerProfile() {
	return (
		<main className='min-h-screen min-w-screen'>
			<Header />
			<UtilityBar />
			<EmployerProfileBoard />
			<Footer />
		</main>
	)
}
