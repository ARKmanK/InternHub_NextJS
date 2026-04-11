'use client'

import { useForm, UseFormReturn } from 'react-hook-form'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import z from 'zod'
import { cn } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'

export const studentSchema = z.object({
	email: z
		.string()
		.email('Введите корректный email')
		.min(6, 'Email должен содержать минимум 6 символов')
		.max(50, 'Email может содержать максимум 50 символов'),
	password: z
		.string()
		.min(8, 'Пароль должен содержать минимум 8 символов')
		.max(30, 'Пароль может содержать максимум 30 символов'),
	firstName: z
		.string()
		.min(2, 'Имя должно содержать минимум 2 символа')
		.max(15, 'Имя может содержать максимум 15 символов'),
	lastName: z
		.string()
		.min(2, 'Фамилия должна содержать минимум 2 символа')
		.max(20, 'Фамилия может содержать максимум 20 символов'),
	group: z
		.string()
		.min(3, 'Группа должна содержать минимум 3 символа')
		.max(20, 'Группа может содержать максимум 20 символов'),
	grade: z.number().min(1, 'Укажите курс').max(6, 'Курс должен быть от 1 до 6'),
})
export type StudentFormData = z.infer<typeof studentSchema>

export const StudentForm = () => {
	const studentForm = useForm<StudentFormData>({
		resolver: zodResolver(studentSchema),
		defaultValues: {
			email: '',
			password: '',
			firstName: '',
			lastName: '',
			group: '',
			grade: 1,
		},
		mode: 'onChange',
	})

	const onStudentSubmit = async (values: StudentFormData) => {
		try {
			console.log('Регистрация студента:', values)
		} catch (error) {
			console.error('Ошибка регистрации:', error)
		}
	}

	return (
		<Form {...studentForm}>
			<form onSubmit={studentForm.handleSubmit(onStudentSubmit)} className='space-y-4'>
				<FormField
					control={studentForm.control}
					name='email'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Email</FormLabel>
							<FormControl>
								<Input placeholder='student@example.com' {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={studentForm.control}
					name='password'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Пароль</FormLabel>
							<FormControl>
								<Input type='password' placeholder='••••••••' {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<div className='grid grid-cols-2 gap-4'>
					<FormField
						control={studentForm.control}
						name='firstName'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Имя</FormLabel>
								<FormControl>
									<Input placeholder='Иван' {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={studentForm.control}
						name='lastName'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Фамилия</FormLabel>
								<FormControl>
									<Input placeholder='Иванов' {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>

				<div className='grid grid-cols-2 gap-4'>
					<FormField
						control={studentForm.control}
						name='group'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Группа</FormLabel>
								<FormControl>
									<Input placeholder='ИВТ-31' {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={studentForm.control}
						name='grade'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Курс</FormLabel>
								<FormControl>
									<Input
										type='number'
										placeholder='1-6'
										{...field}
										onChange={e => field.onChange(e.target.valueAsNumber)}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>

				<Button
					type='submit'
					variant='destructive'
					className={cn(
						'w-full bg-[#1677ff]',
						!studentForm.formState.isValid && 'bg-gray-200 text-gray-600 border-2 border-gray-300',
					)}
					disabled={!studentForm.formState.isValid}
				>
					Зарегистрироваться как студент
				</Button>
			</form>
		</Form>
	)
}
