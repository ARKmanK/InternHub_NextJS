'use client'

import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import z from 'zod'
import { memo, useState } from 'react'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import VerificationForm from './VerificationForm'

const formSchema = z.object({
	companyName: z
		.string()
		.min(3, {
			message: 'Username must be at least 3 characters.',
		})
		.max(20, {
			message: 'Username can have up to 20 characters',
		}),
	mail: z //-----------------------------------Email-----------------------------------//
		.string()
		.min(3, {
			message: 'Username must be at least 3 characters.',
		})
		.max(20, {
			message: 'Username can have up to 20 characters',
		}),
	password: z.string().min(8, {
		message: 'Password must be at least 8 characters.',
	}),
})

function LoginForm() {
	const [showOTPForm, setShowOTPForm] = useState(false)

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			mail: '',
			password: '',
		},
		mode: 'onSubmit',
	})

	/* const { mutate, isPending } = useMutation<ILoginResponse, Error, z.infer<typeof formSchema>>({
		mutationFn: ({ username, password }) => loginUser(username, password),
		onSuccess: data => {
			if (data.success) {
				if (data.requiresOTP) {
					setShowOTPForm(true)
				} else {
					console.log('Успешная авторизация!')
				}
				setApiError(null)
			} else {
				setApiError(data.error || 'Произошла ошибка при авторизации.')
			}
		},
		onError: (err: Error) => {
			setApiError(err.message)
		},
	}) */

	const onSubmit = (values: z.infer<typeof formSchema>) => {
		/* mutate(values) */
	}

	if (showOTPForm) {
		return <VerificationForm />
	}

	return (
		<Tabs defaultValue='login' className='w-100'>
			<TabsList>
				<TabsTrigger value='login'>Login</TabsTrigger>
				<TabsTrigger value='reg'>Registration</TabsTrigger>
			</TabsList>
			<TabsContent value='login'>
				<Card>
					<CardHeader></CardHeader>
					<CardContent>
						<form id='loginForm' onSubmit={form.handleSubmit(onSubmit)}>
							<Controller
								name='mail'
								control={form.control}
								render={({ field, fieldState }) => (
									<Field data-invalid={fieldState.invalid}>
										<FieldLabel htmlFor='form-rhf-demo-title'>Email</FieldLabel>
										<Input
											{...field}
											id='form-rhf-demo-title'
											type='email'
											aria-invalid={fieldState.invalid}
											placeholder='Login button not working on mobile'
											autoComplete='off'
										/>
										{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
									</Field>
								)}
							/>
							<Controller
								name='password'
								control={form.control}
								render={({ field, fieldState }) => (
									<Field data-invalid={fieldState.invalid}>
										<FieldLabel htmlFor='form-rhf-demo-title'>Пароль</FieldLabel>
										<Input
											{...field}
											id='form-rhf-demo-title'
											type='password'
											aria-invalid={fieldState.invalid}
											placeholder='Login button not working on mobile'
											autoComplete='off'
										/>
										{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
									</Field>
								)}
							/>
						</form>
					</CardContent>
					<CardFooter>
						<Field orientation={'horizontal'}>
							<Button type='button' onClick={() => form.reset()}>
								Reset
							</Button>
							<Button type='submit' form='loginForm'>
								Submit
							</Button>
						</Field>
					</CardFooter>
				</Card>
			</TabsContent>
			<TabsContent value='reg'>
				<Tabs defaultValue='user' className='w-100'>
					<TabsList>
						<TabsTrigger value='user'>User</TabsTrigger>
						<TabsTrigger value='company'>Company</TabsTrigger>
					</TabsList>
					<TabsContent value='user'>
						<Card>
							<CardHeader></CardHeader>
							<CardContent>
								<form id='registrationForm' onSubmit={form.handleSubmit(onSubmit)}>
									<Controller
										name='mail'
										control={form.control}
										render={({ field, fieldState }) => (
											<Field data-invalid={fieldState.invalid}>
												<FieldLabel htmlFor='form-rhf-demo-title'>Email</FieldLabel>
												<Input
													{...field}
													id='form-rhf-demo-title'
													type='email'
													aria-invalid={fieldState.invalid}
													placeholder='Login button not working on mobile'
													autoComplete='off'
												/>
												{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
											</Field>
										)}
									/>
									<Controller
										name='password'
										control={form.control}
										render={({ field, fieldState }) => (
											<Field data-invalid={fieldState.invalid}>
												<FieldLabel htmlFor='form-rhf-demo-title'>Пароль</FieldLabel>
												<Input
													{...field}
													id='form-rhf-demo-title'
													type='password'
													aria-invalid={fieldState.invalid}
													placeholder='Login button not working on mobile'
													autoComplete='off'
												/>
												{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
											</Field>
										)}
									/>
								</form>
							</CardContent>
							<CardFooter>
								<Field orientation={'horizontal'}>
									<Button type='button' onClick={() => form.reset()}>
										Reset
									</Button>
									<Button type='submit' form='registrationForm'>
										Submit
									</Button>
								</Field>
							</CardFooter>
						</Card>
					</TabsContent>
					<TabsContent value='company'>
						<Card>
							<CardHeader></CardHeader>
							<CardContent>
								<form id='registrationForm' onSubmit={form.handleSubmit(onSubmit)}>
									<Controller
										name='companyName'
										control={form.control}
										render={({ field, fieldState }) => (
											<Field data-invalid={fieldState.invalid}>
												<FieldLabel htmlFor='form-rhf-demo-title'>Email</FieldLabel>
												<Input
													{...field}
													id='form-rhf-demo-title'
													aria-invalid={fieldState.invalid}
													placeholder='Login button not working on mobile'
													autoComplete='off'
												/>
												{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
											</Field>
										)}
									/>
									<Controller
										name='mail'
										control={form.control}
										render={({ field, fieldState }) => (
											<Field data-invalid={fieldState.invalid}>
												<FieldLabel htmlFor='form-rhf-demo-title'>Email</FieldLabel>
												<Input
													{...field}
													id='form-rhf-demo-title'
													type='email'
													aria-invalid={fieldState.invalid}
													placeholder='Login button not working on mobile'
													autoComplete='off'
												/>
												{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
											</Field>
										)}
									/>
									<Controller
										name='password'
										control={form.control}
										render={({ field, fieldState }) => (
											<Field data-invalid={fieldState.invalid}>
												<FieldLabel htmlFor='form-rhf-demo-title'>Пароль</FieldLabel>
												<Input
													{...field}
													id='form-rhf-demo-title'
													type='password'
													aria-invalid={fieldState.invalid}
													placeholder='Login button not working on mobile'
													autoComplete='off'
												/>
												{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
											</Field>
										)}
									/>
								</form>
							</CardContent>
							<CardFooter>
								<Field orientation={'horizontal'}>
									<Button type='button' onClick={() => form.reset()}>
										Reset
									</Button>
									<Button type='submit' form='registrationForm'>
										Submit
									</Button>
								</Field>
							</CardFooter>
						</Card>
					</TabsContent>
				</Tabs>
			</TabsContent>
		</Tabs>
	)
}

export default memo(LoginForm) //------------------------Text------------------------//
