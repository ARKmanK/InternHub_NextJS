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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectSeparator,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'

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
	name: z
		.string()
		.min(2, {
			message: 'Username must be at least 3 characters.',
		})
		.max(20, {
			message: 'Username can have up to 20 characters',
		}),
	surname: z
		.string()
		.min(2, {
			message: 'Username must be at least 3 characters.',
		})
		.max(20, {
			message: 'Username can have up to 20 characters',
		}),
	group: z
		.string()
		.min(2, {
			message: 'Username must be at least 3 characters.',
		})
		.max(20, {
			message: 'Username can have up to 20 characters',
		}),
	grade: z.string(), //------------------------Text------------------------//
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
				<Tabs defaultValue='user' className='w-100'>
					<TabsList></TabsList>
					<TabsContent value='user'>
						<Card>
							<CardHeader></CardHeader>
							<CardContent>
								<form id='loginForm' onSubmit={form.handleSubmit(onSubmit)}>
									<Controller
										name='mail'
										control={form.control}
										render={({ field, fieldState }) => (
											<Field data-invalid={fieldState.invalid}>
												<FieldLabel htmlFor='login-form1-mail'>Email</FieldLabel>
												<Input
													{...field}
													id='login-form1-mail'
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
												<FieldLabel htmlFor='login-form1-password'>Пароль</FieldLabel>
												<Input
													{...field}
													id='login-form1-password'
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
					<TabsContent value='company'>
						<Card>
							<CardHeader></CardHeader>
							<CardContent>
								<form id='loginForm' onSubmit={form.handleSubmit(onSubmit)}>
									<Controller
										name='mail'
										control={form.control}
										render={({ field, fieldState }) => (
											<Field data-invalid={fieldState.invalid}>
												<FieldLabel htmlFor='login-form2-mail'>Email</FieldLabel>
												<Input
													{...field}
													id='login-form2-mail'
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
												<FieldLabel htmlFor='login-form2-password'>Пароль</FieldLabel>
												<Input
													{...field}
													id='login-form2-password'
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
				</Tabs>
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
												<FieldLabel htmlFor='reg-form1-mail'>Email</FieldLabel>
												<Input
													{...field}
													id='reg-form1-mail'
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
												<FieldLabel htmlFor='reg-form1-password'>Пароль</FieldLabel>
												<Input
													{...field}
													id='reg-form1-password'
													type='password'
													aria-invalid={fieldState.invalid}
													placeholder='Login button not working on mobile'
													autoComplete='off'
												/>
												{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
											</Field>
										)}
									/>
									<Controller
										name='name'
										control={form.control}
										render={({ field, fieldState }) => (
											<Field data-invalid={fieldState.invalid}>
												<FieldLabel htmlFor='reg-form1-name'>Name</FieldLabel>
												<Input
													{...field}
													id='reg-form1-name'
													aria-invalid={fieldState.invalid}
													placeholder='Login button not working on mobile'
													autoComplete='off'
												/>
												{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
											</Field>
										)}
									/>
									<Controller
										name='surname'
										control={form.control}
										render={({ field, fieldState }) => (
											<Field data-invalid={fieldState.invalid}>
												<FieldLabel htmlFor='reg-form1-surname'>Surname</FieldLabel>
												<Input
													{...field}
													id='reg-form1-surname'
													aria-invalid={fieldState.invalid}
													placeholder='Login button not working on mobile'
													autoComplete='off'
												/>
												{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
											</Field>
										)}
									/>
									<Controller
										name='group'
										control={form.control}
										render={({ field, fieldState }) => (
											<Field data-invalid={fieldState.invalid}>
												<FieldLabel htmlFor='reg-form1-group'>Group</FieldLabel>
												<Input
													{...field}
													id='reg-form1-group'
													aria-invalid={fieldState.invalid}
													placeholder='Login button not working on mobile'
													autoComplete='off'
												/>
												{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
											</Field>
										)}
									/>
									<Controller
										name='grade'
										control={form.control}
										render={({ field, fieldState }) => (
											<Field data-invalid={fieldState.invalid}>
												<FieldLabel htmlFor='reg-form1-grade'>Grade</FieldLabel>
												<Select value={field.value} onValueChange={field.onChange}>
													<SelectTrigger
														id='reg-form1-grade'
														aria-invalid={fieldState.invalid}
														className='min-w-30'
													>
														<SelectValue placeholder='Select' />
													</SelectTrigger>
													<SelectContent position='item-aligned'>
														<SelectItem value='auto'>Auto</SelectItem>
														<SelectSeparator />
														{['1', '2', '3', '4'].map((_, index) => (
															<SelectItem key={index} value={_}>
																{_}
															</SelectItem>
														))}
													</SelectContent>
												</Select>
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
												<FieldLabel htmlFor='reg-form2-companyname'>Email</FieldLabel>
												<Input
													{...field}
													id='reg-form2-companyname'
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
												<FieldLabel htmlFor='reg-form2-mail'>Email</FieldLabel>
												<Input
													{...field}
													id='reg-form2-mail'
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
												<FieldLabel htmlFor='reg-form2-password'>Пароль</FieldLabel>
												<Input
													{...field}
													id='reg-form2-password'
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
