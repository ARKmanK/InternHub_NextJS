'use client'

import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { useLoginUser } from '../../login-user/model/useLoginUser'

const loginCompanySchema = z.object({
	email: z.string().email({ message: 'Введите корректный email' }),
	password: z.string().min(8, { message: 'Пароль минимум 8 символов' }),
})

type LoginCompanyFormData = z.infer<typeof loginCompanySchema>

export const LoginCompanyForm = () => {
	const { login, isLoading, error } = useLoginUser()

	const form = useForm<LoginCompanyFormData>({
		resolver: zodResolver(loginCompanySchema),
		defaultValues: { email: '', password: '' },
		mode: 'onSubmit',
	})

	const onSubmit = async (data: LoginCompanyFormData) => {
		await login(data.email, data.password)
	}

	return (
		<Card>
			<CardHeader />
			<CardContent>
				<form id='login-company-form' onSubmit={form.handleSubmit(onSubmit)}>
					<Controller
						name='email'
						control={form.control}
						render={({ field, fieldState }) => (
							<Field data-invalid={fieldState.invalid}>
								<FieldLabel htmlFor='login-company-email'>Email</FieldLabel>
								<Input {...field} id='login-company-email' type='email' />
								{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
							</Field>
						)}
					/>
					<Controller
						name='password'
						control={form.control}
						render={({ field, fieldState }) => (
							<Field data-invalid={fieldState.invalid}>
								<FieldLabel htmlFor='login-company-password'>Пароль</FieldLabel>
								<Input {...field} id='login-company-password' type='password' />
								{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
							</Field>
						)}
					/>
					{error && <p className='text-red-500 text-sm'>{error}</p>}
				</form>
			</CardContent>
			<CardFooter>
				<Button type='submit' form='login-company-form' disabled={isLoading}>
					{isLoading ? 'Вход...' : 'Войти'}
				</Button>
			</CardFooter>
		</Card>
	)
}
