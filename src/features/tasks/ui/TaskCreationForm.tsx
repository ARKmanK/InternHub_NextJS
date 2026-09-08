import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { zodResolver } from '@hookform/resolvers/zod'
import { ChevronDownIcon, Table2Icon } from 'lucide-react'
import { Controller, useForm } from 'react-hook-form'
import z from 'zod'
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { format } from 'date-fns'
import { Calendar } from '@/components/ui/calendar'

const formSchema = z.object({
	name: z
		.string()
		.min(2, {
			message: 'Username must be at least 3 characters.',
		})
		.max(20, {
			message: 'Username can have up to 20 characters',
		}),
	description: z
		.string()
		.min(20, {
			message: 'Username must be at least 20 characters.',
		})
		.max(3000, {
			message: 'Username can have up to 3000 characters',
		}),
	difficulty: z.string(),
	date: z.string(),
	tags: z.string(),
})

export default function TaskCreationForm() {
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		/* defaultValues: {
			name: '',
			password: '',
		}, */
		mode: 'onSubmit',
	})

	const onSubmit = () => {}

	return (
		<Card>
			<CardHeader>
				<CardTitle>
					<Table2Icon /> Создание задачи
				</CardTitle>
			</CardHeader>
			<CardContent>
				<form id='taskCreationForm' onSubmit={form.handleSubmit(onSubmit)}>
					<Controller
						name='name'
						control={form.control}
						render={({ field, fieldState }) => (
							<Field data-invalid={fieldState.invalid}>
								<FieldLabel htmlFor='taskCreationForm-name'>Name(max 50 characters)</FieldLabel>
								<Input
									{...field}
									id='taskCreationForm-name'
									aria-invalid={fieldState.invalid}
									placeholder='Login button not working on mobile'
									autoComplete='off'
								/>
								{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
							</Field>
						)}
					/>
					<Controller
						name='description'
						control={form.control}
						render={({ field, fieldState }) => (
							<Field data-invalid={fieldState.invalid}>
								<FieldLabel htmlFor='taskCreationForm-description'>Describe task</FieldLabel>
								<Textarea
									{...field}
									id='taskCreationForm-description'
									aria-invalid={fieldState.invalid}
									placeholder='Describe task...'
									className='min-h-30'
								/>
								{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
							</Field>
						)}
					/>
					<Controller
						name='difficulty'
						control={form.control}
						render={({ field, fieldState }) => (
							<Field data-invalid={fieldState.invalid}>
								<FieldLabel htmlFor='taskCreationForm-difficulty'>Difficulty</FieldLabel>
								<Select name={field.name} value={field.value} onValueChange={field.onChange}>
									<SelectTrigger className='w-full' id='taskCreationForm-difficulty'>
										<SelectValue placeholder='Выберите сложность' />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value='1'>1 — Легко</SelectItem>
										<SelectItem value='2'>2 — Средне</SelectItem>
										<SelectItem value='3'>3 — Тяжело</SelectItem>
									</SelectContent>
								</Select>
								{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
							</Field>
						)}
					/>
					<Controller
						name='date'
						control={form.control}
						render={({ field, fieldState }) => (
							<Field data-invalid={fieldState.invalid}>
								<FieldLabel htmlFor='taskCreationForm-date'>Дата выполнения</FieldLabel>
								<Popover>
									<PopoverTrigger asChild>
										<Button
											id='taskCreationForm-date'
											variant='outline'
											data-empty={!field.value}
											className='w-[212px] justify-between text-left font-normal data-[empty=true]:text-muted-foreground'
										>
											{field.value ? (
												format(new Date(field.value), 'PPP')
											) : (
												<span>Выберите дату</span>
											)}
											<ChevronDownIcon data-icon='inline-end' />
										</Button>
									</PopoverTrigger>
									<PopoverContent className='w-auto p-0' align='start'>
										<Calendar
											mode='single'
											selected={field.value ? new Date(field.value) : undefined}
											onSelect={date => field.onChange(date?.toString())}
										/>
									</PopoverContent>
								</Popover>
								{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
							</Field>
						)}
					/>
					//------------------------Text------------------------//
				</form>
			</CardContent>
		</Card>
	)
}
