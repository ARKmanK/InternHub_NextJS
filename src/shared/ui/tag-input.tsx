'use client'

import { useState, type KeyboardEvent } from 'react'
import { Plus, XIcon } from 'lucide-react'
import { Badge } from './badge'
import { Button } from './button'
import { Input } from './input'

type TagInputProps = {
	id?: string
	value: string[]
	onChange: (tags: string[]) => void
	/** Готовые теги, которые можно выбрать кликом. */
	suggestions?: string[]
	placeholder?: string
	addLabel: string
	removeLabel: (tag: string) => string
	maxLength?: number
	invalid?: boolean
}

/**
 * Управляемое поле для списка тегов. Внутри нет <form> (вложенные формы запрещены в HTML):
 * тег добавляется по Enter или кнопке.
 */
export function TagInput({
	id,
	value,
	onChange,
	suggestions = [],
	placeholder,
	addLabel,
	removeLabel,
	maxLength = 20,
	invalid,
}: TagInputProps) {
	const [draft, setDraft] = useState('')

	const addTag = (raw: string) => {
		const tag = raw.trim()
		if (tag.length < 2 || value.includes(tag)) return
		onChange([...value, tag])
		setDraft('')
	}

	const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
		if (event.key !== 'Enter') return
		event.preventDefault()
		addTag(draft)
	}

	const availableSuggestions = suggestions.filter(tag => !value.includes(tag))

	return (
		<div className='flex flex-col gap-2'>
			{value.length > 0 && (
				<div className='flex flex-wrap gap-1'>
					{value.map(tag => (
						<Badge key={tag} variant='secondary' className='gap-1 pr-1'>
							{tag}
							<button
								type='button'
								aria-label={removeLabel(tag)}
								className='rounded-sm hover:text-destructive'
								onClick={() => onChange(value.filter(item => item !== tag))}
							>
								<XIcon className='size-3' />
							</button>
						</Badge>
					))}
				</div>
			)}
			<div className='flex gap-2'>
				<Input
					id={id}
					value={draft}
					maxLength={maxLength}
					placeholder={placeholder}
					aria-invalid={invalid}
					onChange={event => setDraft(event.target.value)}
					onKeyDown={handleKeyDown}
				/>
				<Button type='button' variant='outline' onClick={() => addTag(draft)}>
					<Plus /> {addLabel}
				</Button>
			</div>
			{availableSuggestions.length > 0 && (
				<div className='flex flex-wrap gap-1'>
					{availableSuggestions.map(tag => (
						<Badge key={tag} variant='outline' asChild>
							<button type='button' onClick={() => addTag(tag)}>
								+ {tag}
							</button>
						</Badge>
					))}
				</div>
			)}
		</div>
	)
}
