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

export const companySchema = z.object({
	email: z
		.string()
		.email('Введите корректный email')
		.min(6, 'Email должен содержать минимум 6 символов')
		.max(50, 'Email может содержать максимум 50 символов'),
	password: z
		.string()
		.min(8, 'Пароль должен содержать минимум 8 символов')
		.max(30, 'Пароль может содержать максимум 30 символов'),
	companyName: z
		.string()
		.min(2, 'Название компании должно содержать минимум 2 символа')
		.max(40, 'Название компании может содержать максимум 40 символов'),
})
export type CompanyFormData = z.infer<typeof companySchema>

export const CompanyForm = () => {
	const companyForm = useForm<CompanyFormData>({
		resolver: zodResolver(companySchema),
		defaultValues: {
			email: '',
			password: '',
			companyName: '',
		},
		mode: 'onChange',
	})

	const onCompanySubmit = async (values: CompanyFormData) => {
		try {
			console.log('Регистрация компании:', values)
		} catch (error) {
			console.error('Ошибка регистрации:', error)
		}
	}

	return (
		<Form {...companyForm}>
			<form onSubmit={companyForm.handleSubmit(onCompanySubmit)} className='space-y-4'>
				<FormField
					control={companyForm.control}
					name='email'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Email</FormLabel>
							<FormControl>
								<Input placeholder='company@example.com' {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={companyForm.control}
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

				<FormField
					control={companyForm.control}
					name='companyName'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Название компании</FormLabel>
							<FormControl>
								<Input placeholder='ООО "Ромашка"' {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<Button
					type='submit'
					variant='destructive'
					className={cn(
						'w-full bg-[#1677ff]',
						!companyForm.formState.isValid && 'bg-gray-200 text-gray-600 border-2 border-gray-300',
					)}
					disabled={!companyForm.formState.isValid}
				>
					Зарегистрировать компанию
				</Button>
			</form>
		</Form>
	)
}
