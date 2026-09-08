type ChoicesType = {
	label: string
	description: string
	value: string
}

type InputType = {
	label: string
	placeholder: string
}

export interface IQuestionnaire {
	choices: ChoicesType[]
	description: string
	input: InputType
	name: string
	required: boolean
	title: string
}
