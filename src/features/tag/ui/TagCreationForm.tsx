'use client'

import { useActions } from '@/app/(store)/hooks/useActions'
import { Button } from '@/components/ui/button'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import z from 'zod'

const formSchema = z.object({
	tagLabel: z
		.string()
		.min(2, {
			message: 'Username must be at least 3 characters.',
		})
		.max(20, {
			message: 'Username can have up to 20 characters',
		}),
})

export default function TagCreationForm() {
	const { addUserTag } = useActions()

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			tagLabel: '',
		},
		mode: 'onChange',
	})

	const onSubmit = (value: z.infer<typeof formSchema>) => {
		addUserTag(value.toString())
		form.reset()
	}

	return (
		<div className='flex space-x-3'>
			<form onSubmit={form.handleSubmit(onSubmit)}>
				<Controller
					name='tagLabel'
					control={form.control}
					render={({ field, fieldState }) => (
						<Field orientation='horizontal'>
							<FieldLabel htmlFor='add-tag-input'>Add new tag</FieldLabel>
							<Input
								{...field}
								id='add-tag-input'
								placeholder='new tag...'
								aria-invalid={fieldState.invalid}
								required
							/>
							{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
						</Field>
					)}
				/>
			</form>
			<Button type='submit'>Add</Button>
		</div>
	)
}
