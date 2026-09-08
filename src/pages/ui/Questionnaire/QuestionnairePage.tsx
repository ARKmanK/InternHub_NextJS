import { SupportChat } from '@/features/chat/ui/SupportChat'
import QuestionnaireBoard from '@/features/questionnaire/ui/QuestionnaireBoard'
import Header from '@/widgets/ui/Header'
import { Footer } from 'react-day-picker'

export default function QuestionnairePage() {
	return (
		<main className='min-h-screen min-w-screen'>
			<Header />
			<QuestionnaireBoard />
			<SupportChat />
			<Footer />
		</main>
	)
}
