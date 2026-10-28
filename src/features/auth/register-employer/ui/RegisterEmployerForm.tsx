'use client'

import { useState, useTransition } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'
import { Button } from '@/shared/ui/button'
import { CheckEmailNotice } from '@/shared/ui/check-email-notice'
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
	inputMode?: 'numeric'
}[] = [
	{ name: 'contactName', autoComplete: 'name' },
	{ name: 'companyName', autoComplete: 'organization' },
	{ name: 'inn', autoComplete: 'off', inputMode: 'numeric' },
	{ name: 'ogrn', autoComplete: 'off', inputMode: 'numeric' },
	{ name: 'email', type: 'email', autoComplete: 'email' },
	{ name: 'password', type: 'password', autoComplete: 'new-password' },
]

export function RegisterEmployerForm() {
	const t = useTranslations('RegisterEmployerForm')
	const tCommon = useTranslations('Common')
	const [isPending, startTransition] = useTransition()
	const [sentTo, setSentTo] = useState<string | null>(null)

	const form = useForm<RegisterEmployerFormValues>({
		resolver: zodResolver(registerEmployerSchema),
		defaultValues: {
			contactName: '',
			companyName: '',
			inn: '',
			ogrn: '',
			email: '',
			password: '',
		},
	})

	const onSubmit = (values: RegisterEmployerFormValues) =>
		startTransition(async () => {
			const result = await registerEmployerAction(values)
			if (!result.ok) {
				toast.error(tCommon(result.error))
				return
			}
			setSentTo(values.email)
		})

	if (sentTo) return <CheckEmailNotice email={sentTo} />

	return (
		<Card>
			<CardContent>
				<form id='register-employer-form' onSubmit={form.handleSubmit(onSubmit)} noValidate>
					<FieldGroup>
						{fields.map(({ name, type, autoComplete, inputMode }) => (
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
											inputMode={inputMode}
											aria-invalid={fieldState.invalid}
										/>
										<FormFieldError error={fieldState.error} />
									</Field>
								)}
							/>
						))}
						<p className='text-sm text-muted-foreground'>{t('hint')}</p>
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
