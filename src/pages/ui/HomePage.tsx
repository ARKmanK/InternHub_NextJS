import { SupportChat } from '@/features/chat/ui/SupportChat'
import Footer from '@/widgets/ui/Footer'
import Header from '@/widgets/ui/Header'
import TasksBoard from '@/widgets/ui/TasksBoard'

export default function HomePage() {
	return (
		<main className='min-h-screen min-w-screen'>
			<Header />
			<TasksBoard />
			<SupportChat />
			<Footer />
		</main>
	)
}
