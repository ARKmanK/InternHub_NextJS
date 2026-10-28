'use client'

import { useTransition } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'
import { Button } from '@/shared/ui/button'
import { Card, CardContent, CardFooter } from '@/shared/ui/card'
import { Field, FieldGroup, FieldLabel } from '@/shared/ui/field'
import { FormFieldError } from '@/shared/ui/form-field-error'
import { Input } from '@/shared/ui/input'
import { Spinner } from '@/shared/ui/spinner'
import { registerEmployerAction } from '../api/registerEmployerAction'
import {
	registerEmployerSchema,
	type RegisterEmployerFormValues,
} from '../model/registerEmployerSchema'

const fields: {
	name: keyof RegisterEmployerFormValues
	type?: string
	autoComplete: string
}[] = [
	{ name: 'companyName', autoComplete: 'organization' },
	{ name: 'email', type: 'email', autoComplete: 'email' },
	{ name: 'password', type: 'password', autoComplete: 'new-password' },
]

export function RegisterEmployerForm() {
	const t = useTranslations('RegisterEmployerForm')
	const tCommon = useTranslations('Common')
	const [isPending, startTransition] = useTransition()

	const form = useForm<RegisterEmployerFormValues>({
		resolver: zodResolver(registerEmployerSchema),
		defaultValues: { companyName: '', email: '', password: '' },
	})

	const onSubmit = (values: RegisterEmployerFormValues) =>
		startTransition(async () => {
			const result = await registerEmployerAction(values)
			if (!result.ok) toast.error(tCommon(result.error))
		})

	return (
		<Card>
			<CardContent>
				<form id='register-employer-form' onSubmit={form.handleSubmit(onSubmit)} noValidate>
					<FieldGroup>
						{fields.map(({ name, type, autoComplete }) => (
							<Controller
								key={name}
								name={name}
								control={form.control}
								render={({ field, fieldState }) => (
									<Field data-invalid={fieldState.invalid}>
										<FieldLabel htmlFor={`register-employer-${name}`}>{t(name)}</FieldLabel>
										<Input
											{...field}
											id={`register-employer-${name}`}
											type={type}
											autoComplete={autoComplete}
											aria-invalid={fieldState.invalid}
										/>
										<FormFieldError error={fieldState.error} />
									</Field>
								)}
							/>
						))}
					</FieldGroup>
				</form>
			</CardContent>
			<CardFooter>
				<Button type='submit' form='register-employer-form' className='w-full' disabled={isPending}>
					{isPending ? (
						<>
							<Spinner /> {t('loading')}
						</>
					) : (
						t('register')
					)}
				</Button>
			</CardFooter>
		</Card>
	)
}
