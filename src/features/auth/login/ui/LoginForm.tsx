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
import { loginAction } from '../api/loginAction'
import { loginSchema, type LoginFormValues } from '../model/loginSchema'

export function LoginForm() {
	const t = useTranslations('LoginForm')
	const tCommon = useTranslations('Common')
	const [isPending, startTransition] = useTransition()

	const form = useForm<LoginFormValues>({
		resolver: zodResolver(loginSchema),
		defaultValues: { email: '', password: '' },
	})

	const onSubmit = (values: LoginFormValues) =>
		startTransition(async () => {
			const result = await loginAction(values)
			if (!result.ok) toast.error(tCommon(result.error))
		})

	return (
		<Card>
			<CardContent>
				<form id='login-form' onSubmit={form.handleSubmit(onSubmit)} noValidate>
					<FieldGroup>
						<Controller
							name='email'
							control={form.control}
							render={({ field, fieldState }) => (
								<Field data-invalid={fieldState.invalid}>
									<FieldLabel htmlFor='login-email'>{t('email')}</FieldLabel>
									<Input
										{...field}
										id='login-email'
										type='email'
										autoComplete='email'
										aria-invalid={fieldState.invalid}
									/>
									<FormFieldError error={fieldState.error} />
								</Field>
							)}
						/>
						<Controller
							name='password'
							control={form.control}
							render={({ field, fieldState }) => (
								<Field data-invalid={fieldState.invalid}>
									<FieldLabel htmlFor='login-password'>{t('password')}</FieldLabel>
									<Input
										{...field}
										id='login-password'
										type='password'
										autoComplete='current-password'
										aria-invalid={fieldState.invalid}
									/>
									<FormFieldError error={fieldState.error} />
								</Field>
							)}
						/>
					</FieldGroup>
				</form>
			</CardContent>
			<CardFooter>
				<Button type='submit' form='login-form' className='w-full' disabled={isPending}>
					{isPending ? (
						<>
							<Spinner /> {t('loading')}
						</>
					) : (
						t('logIn')
					)}
				</Button>
			</CardFooter>
		</Card>
	)
}
