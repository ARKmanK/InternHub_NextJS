'use client'

import { useState, useTransition } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { ImageIcon, XIcon } from 'lucide-react'
import { toast } from 'sonner'
import { ARCHIVE_EXTENSIONS, IMAGE_EXTENSIONS } from '@/shared/config'
import { Button } from '@/shared/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/shared/ui/card'
import { Field, FieldDescription, FieldGroup, FieldLabel } from '@/shared/ui/field'
import { FilePicker } from '@/shared/ui/file-picker'
import { FormFieldError } from '@/shared/ui/form-field-error'
import { Input } from '@/shared/ui/input'
import { Spinner } from '@/shared/ui/spinner'
import { Textarea } from '@/shared/ui/textarea'
import { submitSolutionAction } from '../api/submitSolutionAction'
import {
	MAX_IMAGES,
	createSubmitSolutionSchema,
	emptySolution,
	solutionToFormData,
	type SubmitSolutionValues,
} from '../model/submitSolutionSchema'

type SubmitSolutionFormProps = {
	taskId: number
	requireRepository: boolean
	/** Повторная сдача после доработки: подставляем прошлые ссылку и комментарий */
	previous?: { repositoryUrl: string | null; comment: string | null }
}

export function SubmitSolutionForm({
	taskId,
	requireRepository,
	previous,
}: SubmitSolutionFormProps) {
	const t = useTranslations('SubmitSolution')
	const tCommon = useTranslations('Common')
	const [isPending, startTransition] = useTransition()
	const [schema] = useState(() => createSubmitSolutionSchema(requireRepository))

	const form = useForm<SubmitSolutionValues>({
		resolver: zodResolver(schema),
		defaultValues: {
			...emptySolution,
			repositoryUrl: previous?.repositoryUrl ?? '',
			comment: previous?.comment ?? '',
		},
	})

	const onSubmit = (values: SubmitSolutionValues) =>
		startTransition(async () => {
			const result = await submitSolutionAction(taskId, solutionToFormData(values))
			if (!result.ok) {
				toast.error(tCommon(result.error))
				return
			}
			toast.success(t('sent'))
			form.reset(emptySolution)
		})

	return (
		<Card>
			<CardHeader>
				<CardTitle>{previous ? t('resubmitTitle') : t('title')}</CardTitle>
				<CardDescription>{t('description')}</CardDescription>
			</CardHeader>
			<CardContent>
				<form id={`solution-form-${taskId}`} onSubmit={form.handleSubmit(onSubmit)} noValidate>
					<FieldGroup>
						<Controller
							name='repositoryUrl'
							control={form.control}
							render={({ field, fieldState }) => (
								<Field data-invalid={fieldState.invalid}>
									<FieldLabel htmlFor='solution-repository'>
										{requireRepository ? t('repository') : t('repositoryOptional')}
									</FieldLabel>
									<Input
										{...field}
										id='solution-repository'
										type='url'
										placeholder='https://github.com/...'
										aria-invalid={fieldState.invalid}
									/>
									<FormFieldError error={fieldState.error} />
								</Field>
							)}
						/>
						<Controller
							name='comment'
							control={form.control}
							render={({ field, fieldState }) => (
								<Field data-invalid={fieldState.invalid}>
									<FieldLabel htmlFor='solution-comment'>{t('comment')}</FieldLabel>
									<Textarea
										{...field}
										id='solution-comment'
										maxLength={2000}
										placeholder={t('commentPlaceholder')}
										aria-invalid={fieldState.invalid}
									/>
									<FormFieldError error={fieldState.error} />
								</Field>
							)}
						/>
						<Controller
							name='archive'
							control={form.control}
							render={({ field, fieldState }) => (
								<Field data-invalid={fieldState.invalid}>
									<FieldLabel>{t('archive')}</FieldLabel>
									<FilePicker
										value={field.value}
										onChange={field.onChange}
										accept={ARCHIVE_EXTENSIONS.join(',')}
										title={t('archiveTitle')}
										description={t('archiveDescription')}
										chooseLabel={t('chooseFile')}
										removeLabel={t('removeFile')}
										invalid={fieldState.invalid}
									/>
									<FormFieldError error={fieldState.error} />
								</Field>
							)}
						/>
						<Controller
							name='images'
							control={form.control}
							render={({ field, fieldState }) => (
								<Field data-invalid={fieldState.invalid}>
									<FieldLabel htmlFor='solution-images'>{t('images')}</FieldLabel>
									<Input
										id='solution-images'
										type='file'
										multiple
										accept={IMAGE_EXTENSIONS.join(',')}
										aria-invalid={fieldState.invalid}
										onChange={event => {
											const files = Array.from(event.target.files ?? [])
											field.onChange([...field.value, ...files].slice(0, MAX_IMAGES + 1))
											event.target.value = ''
										}}
									/>
									<FieldDescription>{t('imagesHint', { max: MAX_IMAGES })}</FieldDescription>
									{field.value.length > 0 && (
										<ul className='flex flex-col gap-1 text-sm'>
											{field.value.map((image, index) => (
												<li key={`${image.name}-${index}`} className='flex items-center gap-2'>
													<ImageIcon className='size-4' /> {image.name}
													<Button
														type='button'
														variant='ghost'
														size='icon-xs'
														aria-label={t('removeFile')}
														onClick={() =>
															field.onChange(field.value.filter((_, i) => i !== index))
														}
													>
														<XIcon />
													</Button>
												</li>
											))}
										</ul>
									)}
									<FormFieldError error={fieldState.error} />
								</Field>
							)}
						/>
					</FieldGroup>
				</form>
			</CardContent>
			<CardFooter className='justify-end'>
				<Button type='submit' form={`solution-form-${taskId}`} disabled={isPending}>
					{isPending ? (
						<>
							<Spinner /> {t('sending')}
						</>
					) : (
						t('submit')
					)}
				</Button>
			</CardFooter>
		</Card>
	)
}
