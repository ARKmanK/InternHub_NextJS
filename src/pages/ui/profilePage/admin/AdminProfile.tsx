import UtilityBar from '@/shared/ui/tasks/UtilityBar'
import AdminProfileBoard from '@/widgets/ui/admin/AdminProfileBoard'
import Footer from '@/widgets/ui/Footer'
import Header from '@/widgets/ui/Header'
import UserProfileBoard from '@/widgets/ui/user/UserProfileBoard'

export default function AdminProfile() {
	return (
		<main className='min-h-screen min-w-screen'>
			<Header />
			<UtilityBar />
			<AdminProfileBoard />
			<Footer />
		</main>
	)
}
