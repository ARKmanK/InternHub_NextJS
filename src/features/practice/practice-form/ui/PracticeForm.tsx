'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'
import { routes } from '@/shared/config'
import { Button } from '@/shared/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/shared/ui/card'
import { Field, FieldGroup, FieldLabel } from '@/shared/ui/field'
import { FormFieldError } from '@/shared/ui/form-field-error'
import { Input } from '@/shared/ui/input'
import { Spinner } from '@/shared/ui/spinner'
import { Textarea } from '@/shared/ui/textarea'
import { createPracticeAction, updatePracticeAction } from '../api/practiceFormActions'
import { emptyPractice, practiceSchema, type PracticeValues } from '../model/practiceSchema'

type PracticeFormProps =
	{ mode: 'create' } | { mode: 'edit'; practiceId: number; defaultValues: PracticeValues }

const dateFields = ['startsAt', 'endsAt'] as const

export function PracticeForm(props: PracticeFormProps) {
	const t = useTranslations('PracticeForm')
	const tCommon = useTranslations('Common')
	const router = useRouter()
	const [isPending, startTransition] = useTransition()

	const form = useForm<PracticeValues>({
		resolver: zodResolver(practiceSchema),
		defaultValues: props.mode === 'edit' ? props.defaultValues : emptyPractice,
	})

	const onSubmit = (values: PracticeValues) =>
		startTransition(async () => {
			const result =
				props.mode === 'edit'
					? await updatePracticeAction(props.practiceId, values)
					: await createPracticeAction(values)
			if (!result.ok) {
				toast.error(tCommon(result.error))
				return
			}
			router.push(routes.practice(result.data.id))
		})

	return (
		<Card>
			<CardHeader>
				<CardTitle>{props.mode === 'edit' ? t('editTitle') : t('createTitle')}</CardTitle>
			</CardHeader>
			<CardContent>
				<form id='practice-form' onSubmit={form.handleSubmit(onSubmit)} noValidate>
					<FieldGroup>
						<Controller
							name='title'
							control={form.control}
							render={({ field, fieldState }) => (
								<Field data-invalid={fieldState.invalid}>
									<FieldLabel htmlFor='practice-title'>{t('title')}</FieldLabel>
									<Input
										{...field}
										id='practice-title'
										placeholder={t('titlePlaceholder')}
										aria-invalid={fieldState.invalid}
									/>
									<FormFieldError error={fieldState.error} />
								</Field>
							)}
						/>
						<Controller
							name='description'
							control={form.control}
							render={({ field, fieldState }) => (
								<Field data-invalid={fieldState.invalid}>
									<FieldLabel htmlFor='practice-description'>{t('description')}</FieldLabel>
									<Textarea
										{...field}
										id='practice-description'
										placeholder={t('descriptionPlaceholder')}
										aria-invalid={fieldState.invalid}
									/>
									<FormFieldError error={fieldState.error} />
								</Field>
							)}
						/>
						<div className='grid gap-6 sm:grid-cols-2'>
							{dateFields.map(name => (
								<Controller
									key={name}
									name={name}
									control={form.control}
									render={({ field, fieldState }) => (
										<Field data-invalid={fieldState.invalid}>
											<FieldLabel htmlFor={`practice-${name}`}>{t(name)}</FieldLabel>
											<Input
												{...field}
												id={`practice-${name}`}
												type='date'
												aria-invalid={fieldState.invalid}
											/>
											<FormFieldError error={fieldState.error} />
										</Field>
									)}
								/>
							))}
						</div>
					</FieldGroup>
				</form>
			</CardContent>
			<CardFooter className='justify-end'>
				<Button type='submit' form='practice-form' disabled={isPending}>
					{isPending && <Spinner />} {props.mode === 'edit' ? t('save') : t('create')}
				</Button>
			</CardFooter>
		</Card>
	)
}
