'use client'

import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { useRegisterUser } from '../model/useRegisterUser'

const registerUserSchema = z.object({
	email: z.string().email({ message: 'Введите корректный email' }),
	password: z.string().min(8, { message: 'Пароль минимум 8 символов' }),
	name: z.string().min(2).max(20),
	surname: z.string().min(2).max(20),
	group: z.string().min(2).max(20),
	grade: z.string(),
})

type RegisterUserFormData = z.infer<typeof registerUserSchema>

export const RegisterUserForm = () => {
	const { registerUser, isLoading, error } = useRegisterUser()

	const form = useForm<RegisterUserFormData>({
		resolver: zodResolver(registerUserSchema),
		defaultValues: {
			email: '',
			password: '',
			name: '',
			surname: '',
			group: '',
			grade: '',
		},
		mode: 'onSubmit',
	})

	const onSubmit = async (data: RegisterUserFormData) => {
		await registerUser(data)
	}

	return (
		<Card>
			<CardHeader />
			<CardContent>
				<form id='register-user-form' onSubmit={form.handleSubmit(onSubmit)}>
					<Controller
						name='email'
						control={form.control}
						render={({ field, fieldState }) => (
							<Field data-invalid={fieldState.invalid}>
								<FieldLabel htmlFor='register-user-email'>Email</FieldLabel>
								<Input {...field} id='register-user-email' type='email' />
								{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
							</Field>
						)}
					/>
					<Controller
						name='password'
						control={form.control}
						render={({ field, fieldState }) => (
							<Field data-invalid={fieldState.invalid}>
								<FieldLabel htmlFor='register-user-password'>Пароль</FieldLabel>
								<Input {...field} id='register-user-password' type='password' />
								{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
							</Field>
						)}
					/>
					<Controller
						name='name'
						control={form.control}
						render={({ field, fieldState }) => (
							<Field data-invalid={fieldState.invalid}>
								<FieldLabel htmlFor='register-user-name'>Имя</FieldLabel>
								<Input {...field} id='register-user-name' />
								{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
							</Field>
						)}
					/>
					<Controller
						name='surname'
						control={form.control}
						render={({ field, fieldState }) => (
							<Field data-invalid={fieldState.invalid}>
								<FieldLabel htmlFor='register-user-surname'>Фамилия</FieldLabel>
								<Input {...field} id='register-user-surname' />
								{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
							</Field>
						)}
					/>
					<Controller
						name='group'
						control={form.control}
						render={({ field, fieldState }) => (
							<Field data-invalid={fieldState.invalid}>
								<FieldLabel htmlFor='register-user-group'>Группа</FieldLabel>
								<Input {...field} id='register-user-group' />
								{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
							</Field>
						)}
					/>
					<Controller
						name='grade'
						control={form.control}
						render={({ field, fieldState }) => (
							<Field data-invalid={fieldState.invalid}>
								<FieldLabel htmlFor='register-user-grade'>Курс</FieldLabel>
								<Select value={field.value} onValueChange={field.onChange}>
									<SelectTrigger id='register-user-grade'>
										<SelectValue placeholder='Выберите курс' />
									</SelectTrigger>
									<SelectContent>
										{['1', '2', '3', '4'].map(grade => (
											<SelectItem key={grade} value={grade}>
												{grade}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
								{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
							</Field>
						)}
					/>
					{error && <p className='text-red-500 text-sm'>{error}</p>}
				</form>
			</CardContent>
			<CardFooter>
				<Button type='submit' form='register-user-form' disabled={isLoading}>
					{isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
				</Button>
			</CardFooter>
		</Card>
	)
}
