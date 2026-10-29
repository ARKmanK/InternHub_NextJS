'use client'

import { useTransition } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { UserPlus } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/shared/ui/button'
import { Field, FieldLabel } from '@/shared/ui/field'
import { FormFieldError } from '@/shared/ui/form-field-error'
import { Input } from '@/shared/ui/input'
import { Spinner } from '@/shared/ui/spinner'
import { inviteTeacherAction } from '../api/inviteTeacherAction'
import { inviteTeacherSchema, type InviteTeacherValues } from '../model/inviteTeacherSchema'

export function InviteTeacherForm() {
	const t = useTranslations('InviteTeacher')
	const tCommon = useTranslations('Common')
	const [isPending, startTransition] = useTransition()

	const form = useForm<InviteTeacherValues>({
		resolver: zodResolver(inviteTeacherSchema),
		defaultValues: { name: '', email: '' },
	})

	const onSubmit = (values: InviteTeacherValues) =>
		startTransition(async () => {
			const result = await inviteTeacherAction(values)
			if (!result.ok) {
				toast.error(tCommon(result.error))
				return
			}
			toast.success(t('sent', { email: values.email }))
			form.reset()
		})

	return (
		<form
			onSubmit={form.handleSubmit(onSubmit)}
			noValidate
			className='grid items-start gap-3 sm:grid-cols-[1fr_1fr_auto]'
		>
			<Controller
				name='name'
				control={form.control}
				render={({ field, fieldState }) => (
					<Field data-invalid={fieldState.invalid}>
						<FieldLabel htmlFor='invite-teacher-name'>{t('name')}</FieldLabel>
						<Input {...field} id='invite-teacher-name' aria-invalid={fieldState.invalid} />
						<FormFieldError error={fieldState.error} />
					</Field>
				)}
			/>
			<Controller
				name='email'
				control={form.control}
				render={({ field, fieldState }) => (
					<Field data-invalid={fieldState.invalid}>
						<FieldLabel htmlFor='invite-teacher-email'>{t('email')}</FieldLabel>
						<Input
							{...field}
							id='invite-teacher-email'
							type='email'
							aria-invalid={fieldState.invalid}
						/>
						<FormFieldError error={fieldState.error} />
					</Field>
				)}
			/>
			<Button type='submit' disabled={isPending} className='sm:mt-6'>
				{isPending ? <Spinner /> : <UserPlus />} {t('invite')}
			</Button>
		</form>
	)
}
