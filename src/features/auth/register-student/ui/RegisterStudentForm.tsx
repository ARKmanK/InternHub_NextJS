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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select'
import { Spinner } from '@/shared/ui/spinner'
import { registerStudentAction } from '../api/registerStudentAction'
import {
	STUDENT_COURSES,
	registerStudentSchema,
	type RegisterStudentFormValues,
} from '../model/registerStudentSchema'

type TextFieldName = Exclude<keyof RegisterStudentFormValues, 'course'>

const textFields: { name: TextFieldName; type?: string; autoComplete: string }[] = [
	{ name: 'firstName', autoComplete: 'given-name' },
	{ name: 'lastName', autoComplete: 'family-name' },
	{ name: 'group', autoComplete: 'off' },
	{ name: 'email', type: 'email', autoComplete: 'email' },
	{ name: 'password', type: 'password', autoComplete: 'new-password' },
]

export function RegisterStudentForm() {
	const t = useTranslations('RegisterStudentForm')
	const tCommon = useTranslations('Common')
	const [isPending, startTransition] = useTransition()
	const [sentTo, setSentTo] = useState<string | null>(null)

	const form = useForm<RegisterStudentFormValues>({
		resolver: zodResolver(registerStudentSchema),
		defaultValues: {
			firstName: '',
			lastName: '',
			group: '',
			course: '1',
			email: '',
			password: '',
		},
	})

	const onSubmit = (values: RegisterStudentFormValues) =>
		startTransition(async () => {
			const result = await registerStudentAction(values)
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
				<form id='register-student-form' onSubmit={form.handleSubmit(onSubmit)} noValidate>
					<FieldGroup>
						{textFields.map(({ name, type, autoComplete }) => (
							<Controller
								key={name}
								name={name}
								control={form.control}
								render={({ field, fieldState }) => (
									<Field data-invalid={fieldState.invalid}>
										<FieldLabel htmlFor={`register-student-${name}`}>{t(name)}</FieldLabel>
										<Input
											{...field}
											id={`register-student-${name}`}
											type={type}
											autoComplete={autoComplete}
											aria-invalid={fieldState.invalid}
										/>
										<FormFieldError error={fieldState.error} />
									</Field>
								)}
							/>
						))}
						<Controller
							name='course'
							control={form.control}
							render={({ field, fieldState }) => (
								<Field data-invalid={fieldState.invalid}>
									<FieldLabel htmlFor='register-student-course'>{t('course')}</FieldLabel>
									<Select value={field.value} onValueChange={field.onChange}>
										<SelectTrigger id='register-student-course' aria-invalid={fieldState.invalid}>
											<SelectValue placeholder={t('chooseCourse')} />
										</SelectTrigger>
										<SelectContent>
											{STUDENT_COURSES.map(course => (
												<SelectItem key={course} value={course}>
													{course}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									<FormFieldError error={fieldState.error} />
								</Field>
							)}
						/>
					</FieldGroup>
				</form>
			</CardContent>
			<CardFooter>
				<Button type='submit' form='register-student-form' className='w-full' disabled={isPending}>
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
