import {
	Questionnaire,
	QuestionnaireActions,
	QuestionnaireChoice,
	QuestionnaireChoices,
	QuestionnaireDescription,
	QuestionnaireError,
	QuestionnaireInput,
	QuestionnaireItem,
	QuestionnaireNext,
	QuestionnairePrevious,
	QuestionnaireProgress,
	QuestionnaireSkip,
	QuestionnaireSubmit,
	QuestionnaireTitle,
} from '@/components/ui/questionnaire'

export default function QuestionnaireBoard() {
	function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault()

		const formData = new FormData(e.currentTarget)
		const answers = {
			directions: formData.get('direction'),
			signals: formData.get('signals'),
			timing: formData.get('timing'),
		}

		/* toast('Agent plan saved', {
			description: `Direction: ${answers.direction ?? 'None'} · Progress signals: ${answers.signals.join(', ') || 'None'} · Timing: ${answers.timing ?? 'None'}`,
		}) */ //------------------------Text------------------------//
	}

	return <Questionnaire className='mx-auto'></Questionnaire>
}
