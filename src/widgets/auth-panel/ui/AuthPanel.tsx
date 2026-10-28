'use client'

import { useTranslations } from 'next-intl'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs'
import { LoginForm } from '@/features/auth/login'
import { RegisterEmployerForm } from '@/features/auth/register-employer'
import { RegisterStudentForm } from '@/features/auth/register-student'

/** Вход общий для всех ролей; при регистрации пользователь выбирает, кто он. */
export function AuthPanel() {
	const t = useTranslations('AuthPanel')

	return (
		<Tabs defaultValue='login' className='w-full max-w-md'>
			<TabsList className='w-full'>
				<TabsTrigger value='login'>{t('login')}</TabsTrigger>
				<TabsTrigger value='register'>{t('register')}</TabsTrigger>
			</TabsList>
			<TabsContent value='login'>
				<LoginForm />
			</TabsContent>
			<TabsContent value='register'>
				<Tabs defaultValue='student'>
					<TabsList className='w-full'>
						<TabsTrigger value='student'>{t('student')}</TabsTrigger>
						<TabsTrigger value='employer'>{t('employer')}</TabsTrigger>
					</TabsList>
					<TabsContent value='student'>
						<RegisterStudentForm />
					</TabsContent>
					<TabsContent value='employer'>
						<RegisterEmployerForm />
					</TabsContent>
				</Tabs>
			</TabsContent>
		</Tabs>
	)
}
