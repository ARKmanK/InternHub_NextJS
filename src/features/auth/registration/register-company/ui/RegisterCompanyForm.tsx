'use client'

import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { useRegisterCompany } from '../model/useRegisterCompany'

const registerCompanySchema = z.object({
	companyName: z.string().min(3).max(50),
	email: z.string().email({ message: 'Введите корректный email' }),
	password: z.string().min(8, { message: 'Пароль минимум 8 символов' }),
})

type RegisterCompanyFormData = z.infer<typeof registerCompanySchema>

export const RegisterCompanyForm = () => {
	const { registerCompany, isLoading, error } = useRegisterCompany()

	const form = useForm<RegisterCompanyFormData>({
		resolver: zodResolver(registerCompanySchema),
		defaultValues: { companyName: '', email: '', password: '' },
		mode: 'onSubmit',
	})

	const onSubmit = async (data: RegisterCompanyFormData) => {
		await registerCompany(data)
	}

	return (
		<Card>
			<CardHeader />
			<CardContent>
				<form id='register-company-form' onSubmit={form.handleSubmit(onSubmit)}>
					<Controller
						name='companyName'
						control={form.control}
						render={({ field, fieldState }) => (
							<Field data-invalid={fieldState.invalid}>
								<FieldLabel htmlFor='register-company-name'>Название компании</FieldLabel>
								<Input {...field} id='register-company-name' />
								{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
							</Field>
						)}
					/>
					<Controller
						name='email'
						control={form.control}
						render={({ field, fieldState }) => (
							<Field data-invalid={fieldState.invalid}>
								<FieldLabel htmlFor='register-company-email'>Email</FieldLabel>
								<Input {...field} id='register-company-email' type='email' />
								{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
							</Field>
						)}
					/>
					<Controller
						name='password'
						control={form.control}
						render={({ field, fieldState }) => (
							<Field data-invalid={fieldState.invalid}>
								<FieldLabel htmlFor='register-company-password'>Пароль</FieldLabel>
								<Input {...field} id='register-company-password' type='password' />
								{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
							</Field>
						)}
					/>

					{error && <p className='text-red-500 text-sm'>{error}</p>}
				</form>
			</CardContent>
			<CardFooter>
				<Button type='submit' form='register-company-form' disabled={isLoading}>
					{isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
				</Button>
			</CardFooter>
		</Card>
	)
}
