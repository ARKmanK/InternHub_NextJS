'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginUserSchema, LoginUserFormData } from '../model/loginUserSchema'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Controller } from 'react-hook-form'
import { useLoginUser } from '../model/useLoginUser'

export const LoginUserForm = () => {
	const { login, isLoading, error } = useLoginUser()

	const form = useForm<LoginUserFormData>({
		resolver: zodResolver(loginUserSchema),
		defaultValues: { email: '', password: '' },
		mode: 'onSubmit',
	})

	const onSubmit = async (data: LoginUserFormData) => {
		await login(data.email, data.password)
	}

	return (
		<Card>
			<CardHeader />
			<CardContent>
				<form id='login-user-form' onSubmit={form.handleSubmit(onSubmit)}>
					<Controller
						name='email'
						control={form.control}
						render={({ field, fieldState }) => (
							<Field data-invalid={fieldState.invalid}>
								<FieldLabel htmlFor='login-user-email'>Email</FieldLabel>
								<Input {...field} id='login-user-email' type='email' />
								{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
							</Field>
						)}
					/>
					<Controller
						name='password'
						control={form.control}
						render={({ field, fieldState }) => (
							<Field data-invalid={fieldState.invalid}>
								<FieldLabel htmlFor='login-user-password'>Пароль</FieldLabel>
								<Input {...field} id='login-user-password' type='password' />
								{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
							</Field>
						)}
					/>
					{error && <p className='text-red-500 text-sm'>{error}</p>}
				</form>
			</CardContent>
			<CardFooter>
				<Button type='submit' form='login-user-form' disabled={isLoading}>
					{isLoading ? 'Вход...' : 'Войти'}
				</Button>
			</CardFooter>
		</Card>
	)
}
