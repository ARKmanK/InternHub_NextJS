'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useFormatter, useTranslations } from 'next-intl'
import { CalendarIcon, ChevronDownIcon } from 'lucide-react'
import { toast } from 'sonner'
import { ARCHIVE_EXTENSIONS, routes } from '@/shared/config'
import { Button } from '@/shared/ui/button'
import { Calendar } from '@/shared/ui/calendar'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/shared/ui/card'
import { Checkbox } from '@/shared/ui/checkbox'
import { Field, FieldDescription, FieldGroup, FieldLabel } from '@/shared/ui/field'
import { FilePicker } from '@/shared/ui/file-picker'
import { FormFieldError } from '@/shared/ui/form-field-error'
import { Input } from '@/shared/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select'
import { Spinner } from '@/shared/ui/spinner'
import { TagInput } from '@/shared/ui/tag-input'
import { Textarea } from '@/shared/ui/textarea'
import { emptyTaskForm, taskFormSchema, type TaskFormValues } from '@/entities/task'
import { createTaskAction, updateTaskAction } from '../api/taskFormActions'
import { taskFormToFormData } from '../lib/toFormData'

type TaskFormProps =
	| { mode: 'create'; tagSuggestions: string[] }
	| {
			mode: 'edit'
			taskId: number
			defaultValues: TaskFormValues
			tagSuggestions: string[]
			/** У задания уже есть архив: если новый не выбран, он остаётся */
			hasArchive: boolean
	  }

const difficulties = [
	{ value: '1', label: 'lvl1' },
	{ value: '2', label: 'lvl2' },
	{ value: '3', label: 'lvl3' },
] as const

const longTextFields = ['expectedResult', 'criteria'] as const

const ipTermsOptions = [
	{ value: 'open', label: 'ipOpen' },
	{ value: 'portfolio_only', label: 'ipPortfolioOnly' },
	{ value: 'nda', label: 'ipNda' },
] as const

/** Одна форма для создания и редактирования задания (раньше было две копии). */
export function TaskForm(props: TaskFormProps) {
	const t = useTranslations('TaskForm')
	const tCommon = useTranslations('Common')
	const format = useFormatter()
	const router = useRouter()
	const [isPending, startTransition] = useTransition()

	const form = useForm<TaskFormValues>({
		resolver: zodResolver(taskFormSchema),
		defaultValues: props.mode === 'edit' ? props.defaultValues : emptyTaskForm,
	})

	const onSubmit = (values: TaskFormValues) =>
		startTransition(async () => {
			const formData = taskFormToFormData(values)
			const result =
				props.mode === 'edit'
					? await updateTaskAction(props.taskId, formData)
					: await createTaskAction(formData)

			if (!result.ok) {
				toast.error(tCommon(result.error))
				return
			}
			router.push(routes.task(result.data.id))
		})

	return (
		<Card>
			<CardHeader>
				<CardTitle>{props.mode === 'edit' ? t('editTitle') : t('createTitle')}</CardTitle>
			</CardHeader>
			<CardContent>
				<form id='task-form' onSubmit={form.handleSubmit(onSubmit)} noValidate>
					<FieldGroup>
						<Controller
							name='title'
							control={form.control}
							render={({ field, fieldState }) => (
								<Field data-invalid={fieldState.invalid}>
									<FieldLabel htmlFor='task-form-title'>{t('title')}</FieldLabel>
									<Input
										{...field}
										id='task-form-title'
										placeholder={t('titlePlaceholder')}
										autoComplete='off'
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
									<FieldLabel htmlFor='task-form-description'>{t('description')}</FieldLabel>
									<Textarea
										{...field}
										id='task-form-description'
										placeholder={t('descriptionPlaceholder')}
										className='min-h-32'
										aria-invalid={fieldState.invalid}
									/>
									<FormFieldError error={fieldState.error} />
								</Field>
							)}
						/>
						{longTextFields.map(name => (
							<Controller
								key={name}
								name={name}
								control={form.control}
								render={({ field, fieldState }) => (
									<Field data-invalid={fieldState.invalid}>
										<FieldLabel htmlFor={`task-form-${name}`}>{t(name)}</FieldLabel>
										<Textarea
											{...field}
											id={`task-form-${name}`}
											placeholder={t(`${name}Placeholder`)}
											aria-invalid={fieldState.invalid}
										/>
										<FormFieldError error={fieldState.error} />
									</Field>
								)}
							/>
						))}
						<div className='grid gap-6 sm:grid-cols-2'>
							<Controller
								name='ipTerms'
								control={form.control}
								render={({ field, fieldState }) => (
									<Field data-invalid={fieldState.invalid}>
										<FieldLabel htmlFor='task-form-ipTerms'>{t('ipTerms')}</FieldLabel>
										<Select
											name={field.name}
											value={field.value}
											onValueChange={value => {
												field.onChange(value)
												// Для NDA код обычно нельзя выкладывать — ссылка на репозиторий не обязательна
												form.setValue('requireRepository', value === 'open')
											}}
										>
											<SelectTrigger id='task-form-ipTerms' className='w-full'>
												<SelectValue />
											</SelectTrigger>
											<SelectContent>
												{ipTermsOptions.map(({ value, label }) => (
													<SelectItem key={value} value={value}>
														{t(label)}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
										<FieldDescription>{t('ipTermsHint')}</FieldDescription>
										<FormFieldError error={fieldState.error} />
									</Field>
								)}
							/>
							<Controller
								name='maxParticipants'
								control={form.control}
								render={({ field, fieldState }) => (
									<Field data-invalid={fieldState.invalid}>
										<FieldLabel htmlFor='task-form-maxParticipants'>
											{t('maxParticipants')}
										</FieldLabel>
										<Input
											{...field}
											id='task-form-maxParticipants'
											inputMode='numeric'
											placeholder={t('maxParticipantsPlaceholder')}
											aria-invalid={fieldState.invalid}
										/>
										<FormFieldError error={fieldState.error} />
									</Field>
								)}
							/>
						</div>
						<Controller
							name='requireRepository'
							control={form.control}
							render={({ field }) => (
								<Field orientation='horizontal'>
									<Checkbox
										id='task-form-requireRepository'
										checked={field.value}
										onCheckedChange={checked => field.onChange(checked === true)}
									/>
									<FieldLabel htmlFor='task-form-requireRepository'>
										{t('requireRepository')}
									</FieldLabel>
								</Field>
							)}
						/>
						<div className='grid gap-6 sm:grid-cols-2'>
							<Controller
								name='difficulty'
								control={form.control}
								render={({ field, fieldState }) => (
									<Field data-invalid={fieldState.invalid}>
										<FieldLabel htmlFor='task-form-difficulty'>{t('difficulty')}</FieldLabel>
										<Select name={field.name} value={field.value} onValueChange={field.onChange}>
											<SelectTrigger id='task-form-difficulty' className='w-full'>
												<SelectValue />
											</SelectTrigger>
											<SelectContent>
												{difficulties.map(({ value, label }) => (
													<SelectItem key={value} value={value}>
														{t(label)}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
										<FormFieldError error={fieldState.error} />
									</Field>
								)}
							/>
							<Controller
								name='deadline'
								control={form.control}
								render={({ field, fieldState }) => (
									<Field data-invalid={fieldState.invalid}>
										<FieldLabel htmlFor='task-form-deadline'>{t('deadline')}</FieldLabel>
										<Popover>
											<PopoverTrigger asChild>
												<Button
													id='task-form-deadline'
													type='button'
													variant='outline'
													className='w-full justify-between font-normal'
												>
													<span className='flex items-center gap-2'>
														<CalendarIcon />
														{field.value
															? format.dateTime(field.value, { dateStyle: 'long' })
															: t('chooseDate')}
													</span>
													<ChevronDownIcon />
												</Button>
											</PopoverTrigger>
											<PopoverContent className='w-auto p-0' align='start'>
												<Calendar
													mode='single'
													selected={field.value ?? undefined}
													onSelect={date => field.onChange(date ?? null)}
													disabled={{ before: new Date() }}
												/>
												{field.value && (
													<Button
														type='button'
														variant='ghost'
														className='w-full'
														onClick={() => field.onChange(null)}
													>
														{t('clearDate')}
													</Button>
												)}
											</PopoverContent>
										</Popover>
										<FormFieldError error={fieldState.error} />
									</Field>
								)}
							/>
						</div>
						<Controller
							name='tags'
							control={form.control}
							render={({ field, fieldState }) => (
								<Field data-invalid={fieldState.invalid}>
									<FieldLabel htmlFor='task-form-tags'>{t('tags')}</FieldLabel>
									<TagInput
										id='task-form-tags'
										value={field.value}
										onChange={field.onChange}
										suggestions={props.tagSuggestions}
										placeholder={t('tagPlaceholder')}
										addLabel={t('addTag')}
										removeLabel={tag => t('removeTag', { tag })}
										invalid={fieldState.invalid}
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
									{props.mode === 'edit' && props.hasArchive && !field.value && (
										<FieldDescription>{t('archiveKept')}</FieldDescription>
									)}
									<FormFieldError error={fieldState.error} />
								</Field>
							)}
						/>
					</FieldGroup>
				</form>
			</CardContent>
			<CardFooter className='justify-end'>
				<Button type='submit' form='task-form' disabled={isPending}>
					{isPending ? (
						<>
							<Spinner /> {t('sending')}
						</>
					) : props.mode === 'edit' ? (
						t('submitEdit')
					) : (
						t('submitCreate')
					)}
				</Button>
			</CardFooter>
		</Card>
	)
}
