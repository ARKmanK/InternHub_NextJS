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
import { toast } from 'sonner'

export default function QuestionnaireBoard() {
	function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault()

		const formData = new FormData(e.currentTarget)
		const answers = {
			directions: formData.get('direction'),
			signals: formData.get('signals'),
			timing: formData.get('timing'),
		}

		toast('Agent plan saved', {
			description: `Direction: ${answers.directions ?? 'None'} · Progress signals: ${answers.signals ? +', ' || 'None' : null} · Timing: ${answers.timing ?? 'None'}`,
		}) //------------------------Text------------------------//
	}

	return (
		<Questionnaire
			className='mx-auto max-w-md'
			defaultItem='direction'
			items={questionnaireItems}
			shortcuts='letters'
			onSubmit={handleSubmit}
		>
			<QuestionnaireProgress />
			{questionnaireItems.map(question => (
				<QuestionnaireItem
					key={question.name}
					multiple={'multiple' in question && question.multiple}
					name={question.name}
					required={question.required}
				>
					<QuestionnaireTitle>{question.title}</QuestionnaireTitle>
					<QuestionnaireDescription>{question.description}</QuestionnaireDescription>
					<QuestionnaireChoices>
						{question.choices.map(choice => (
							<QuestionnaireChoice key={choice.value} value={choice.value}>
								<span className='font-medium'>{choice.label}</span>
								{'description' in choice ? (
									<span className='text-muted-foreground'>{choice.description}</span>
								) : null}
							</QuestionnaireChoice>
						))}
						{'input' in question ? (
							<QuestionnaireInput
								aria-label={question.input.label}
								placeholder={question.input.placeholder}
							/>
						) : null}
					</QuestionnaireChoices>
					<QuestionnaireError />
				</QuestionnaireItem>
			))}
			<QuestionnaireActions>
				<QuestionnairePrevious />
				<QuestionnaireSkip />
				<QuestionnaireNext>Next</QuestionnaireNext>
				<QuestionnaireSubmit>Save plan</QuestionnaireSubmit>
			</QuestionnaireActions>
		</Questionnaire>
	)
}
