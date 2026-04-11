'use client'

import z from 'zod'
import { Circle, LockKeyhole, User } from 'lucide-react'
import { useMutation } from '@tanstack/react-query'
import { memo, useState } from 'react'
import { ILoginResponse, loginUser } from '@/lib/mocks'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import VerificationForm from './VerificationForm'
import { Form, FormControl, FormField, FormItem, FormMessage } from './ui/form'
import { Button } from './ui/button'
import { cn } from '@/lib/utils'
import { Input } from './ui/input'
import RegistrationForm from './RegistrationForm/RegistrationForm'

const formSchema = z.object({
	username: z
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

const LoginForm = () => {
	const [apiError, setApiError] = useState<string | null>(null)
	const [showOTPForm, setShowOTPForm] = useState(false)
	const [showRegistryForm, setShowRegistryForm] = useState(false)

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			username: '',
			password: '',
		},
		mode: 'onChange',
	})

	const { mutate, isPending } = useMutation<ILoginResponse, Error, z.infer<typeof formSchema>>({
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
	})

	const onSubmit = (values: z.infer<typeof formSchema>) => {
		mutate(values)
	}

	if (showOTPForm) {
		return <VerificationForm />
	}

	if (showRegistryForm) {
		return <RegistrationForm />
	}

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className='space-y-4 bg-white rounded-[10px] text-black p-6 pb-2 shadow-2xl'
			>
				<div className='flex flex-col items-center mb-8'>
					<p className='flex font-semibold justify-center my-4'>
						<Circle size={26} color='#1677ff' strokeWidth={4} className='mr-2' />
						Company
					</p>
					<p className='w-[80%] text-xl font-semibold text-center'>
						Sign in to your account to continue
					</p>
				</div>
				{apiError && (
					<div className='p-3 bg-red-100 text-red-600 rounded-md text-center'>{apiError}</div>
				)}
				<FormField
					control={form.control}
					name='username'
					render={({ field }) => (
						<FormItem>
							<FormControl>
								<div className='relative'>
									<User
										className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400'
										size={18}
									/>
									<Input
										placeholder='Username'
										className='pl-10 border-2 border-gray-200 focus:border-none'
										{...field}
									/>
								</div>
							</FormControl>
							<FormMessage className='text-red-500' />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name='password'
					render={({ field }) => (
						<FormItem>
							<FormControl>
								<div className='relative'>
									<LockKeyhole
										className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400'
										size={18}
									/>
									<Input
										type='password'
										placeholder='Password'
										className='pl-10 border-2 border-gray-200 focus:border-none'
										{...field}
									/>
								</div>
							</FormControl>
							<FormMessage className='text-red-500' />
						</FormItem>
					)}
				/>
				<Button
					type='submit'
					variant='destructive'
					className={cn(
						'w-full bg-[#1677ff]',
						!form.formState.isValid && 'bg-gray-200 text-gray-600 border-2 border-gray-300',
					)}
					disabled={!form.formState.isValid || isPending}
				>
					Log in
				</Button>
				<div className='w-full flex justify-end'>
					<Button onClick={() => setShowRegistryForm(true)} variant={'link'}>
						Зарегистрироваться
					</Button>
				</div>
			</form>
		</Form>
	)
}

export default memo(LoginForm)
