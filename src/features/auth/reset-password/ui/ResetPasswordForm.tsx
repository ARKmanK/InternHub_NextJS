'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { CircleCheck, LinkIcon } from 'lucide-react'
import { toast } from 'sonner'
import { routes } from '@/shared/config'
import { Button } from '@/shared/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/shared/ui/card'
import {
	Empty,
	EmptyContent,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from '@/shared/ui/empty'
import { Field, FieldGroup, FieldLabel } from '@/shared/ui/field'
import { FormFieldError } from '@/shared/ui/form-field-error'
import { Input } from '@/shared/ui/input'
import { Spinner } from '@/shared/ui/spinner'
import { resetPasswordAction } from '../api/resetPasswordActions'
import { resetPasswordSchema, type ResetPasswordValues } from '../model/resetPasswordSchemas'

type ResetPasswordFormProps = {
	/** Токен из ссылки; null — ссылка неверная или устарела (Better Auth передал ?error=INVALID_TOKEN). */
	token: string | null
}

const passwordFields = [
	{ name: 'password', autoComplete: 'new-password' },
	{ name: 'confirmPassword', autoComplete: 'new-password' },
] as const

export function ResetPasswordForm({ token }: ResetPasswordFormProps) {
	const t = useTranslations('ResetPassword')
	const tCommon = useTranslations('Common')
	const [isPending, startTransition] = useTransition()
	const [status, setStatus] = useState<'form' | 'done' | 'invalid'>(token ? 'form' : 'invalid')

	const form = useForm<ResetPasswordValues>({
		resolver: zodResolver(resetPasswordSchema),
		defaultValues: { password: '', confirmPassword: '' },
	})

	const onSubmit = (values: ResetPasswordValues) =>
		startTransition(async () => {
			const result = await resetPasswordAction(token ?? '', values)
			if (result.ok) return setStatus('done')
			if (result.error === 'invalidToken') return setStatus('invalid')
			toast.error(tCommon(result.error))
		})

	if (status !== 'form') {
		const isDone = status === 'done'
		return (
			<Empty className='border'>
				<EmptyHeader>
					<EmptyMedia variant='icon'>{isDone ? <CircleCheck /> : <LinkIcon />}</EmptyMedia>
					<EmptyTitle>{isDone ? t('doneTitle') : t('invalidLinkTitle')}</EmptyTitle>
					<EmptyDescription>
						{isDone ? t('doneDescription') : t('invalidLinkDescription')}
					</EmptyDescription>
				</EmptyHeader>
				<EmptyContent>
					<Button asChild>
						<Link href={isDone ? routes.profile() : routes.forgotPassword()}>
							{isDone ? t('toLogin') : t('requestNew')}
						</Link>
					</Button>
				</EmptyContent>
			</Empty>
		)
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>{t('resetTitle')}</CardTitle>
			</CardHeader>
			<CardContent>
				<form id='reset-password-form' onSubmit={form.handleSubmit(onSubmit)} noValidate>
					<FieldGroup>
						{passwordFields.map(({ name, autoComplete }) => (
							<Controller
								key={name}
								name={name}
								control={form.control}
								render={({ field, fieldState }) => (
									<Field data-invalid={fieldState.invalid}>
										<FieldLabel htmlFor={`reset-${name}`}>{t(name)}</FieldLabel>
										<Input
											{...field}
											id={`reset-${name}`}
											type='password'
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
				<Button type='submit' form='reset-password-form' className='w-full' disabled={isPending}>
					{isPending ? (
						<>
							<Spinner /> {t('sending')}
						</>
					) : (
						t('save')
					)}
				</Button>
			</CardFooter>
		</Card>
	)
}
