'use client'

import { useState, useTransition } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'
import { Button } from '@/shared/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/shared/ui/card'
import { CheckEmailNotice } from '@/shared/ui/check-email-notice'
import { Field, FieldLabel } from '@/shared/ui/field'
import { FormFieldError } from '@/shared/ui/form-field-error'
import { Input } from '@/shared/ui/input'
import { Spinner } from '@/shared/ui/spinner'
import { requestPasswordResetAction } from '../api/resetPasswordActions'
import { forgotPasswordSchema, type ForgotPasswordValues } from '../model/resetPasswordSchemas'

export function ForgotPasswordForm() {
	const t = useTranslations('ResetPassword')
	const tCommon = useTranslations('Common')
	const [isPending, startTransition] = useTransition()
	const [sentTo, setSentTo] = useState<string | null>(null)

	const form = useForm<ForgotPasswordValues>({
		resolver: zodResolver(forgotPasswordSchema),
		defaultValues: { email: '' },
	})

	const onSubmit = (values: ForgotPasswordValues) =>
		startTransition(async () => {
			const result = await requestPasswordResetAction(values)
			if (!result.ok) {
				toast.error(tCommon(result.error))
				return
			}
			setSentTo(values.email)
		})

	if (sentTo) return <CheckEmailNotice email={sentTo} />

	return (
		<Card>
			<CardHeader>
				<CardTitle>{t('forgotTitle')}</CardTitle>
				<CardDescription>{t('forgotDescription')}</CardDescription>
			</CardHeader>
			<CardContent>
				<form id='forgot-password-form' onSubmit={form.handleSubmit(onSubmit)} noValidate>
					<Controller
						name='email'
						control={form.control}
						render={({ field, fieldState }) => (
							<Field data-invalid={fieldState.invalid}>
								<FieldLabel htmlFor='forgot-email'>{t('email')}</FieldLabel>
								<Input
									{...field}
									id='forgot-email'
									type='email'
									autoComplete='email'
									aria-invalid={fieldState.invalid}
								/>
								<FormFieldError error={fieldState.error} />
							</Field>
						)}
					/>
				</form>
			</CardContent>
			<CardFooter>
				<Button type='submit' form='forgot-password-form' className='w-full' disabled={isPending}>
					{isPending ? (
						<>
							<Spinner /> {t('sending')}
						</>
					) : (
						t('send')
					)}
				</Button>
			</CardFooter>
		</Card>
	)
}
