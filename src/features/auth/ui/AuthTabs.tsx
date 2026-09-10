'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { LoginUserForm } from '../login/login-user/ui/LoginUserForm'
import { LoginCompanyForm } from '../login/login-company/ui/LoginCompanyForm'
import { RegisterUserForm } from '../registration/register-user/ui/RegisterUserForm'
import { RegisterCompanyForm } from '../registration/register-company/ui/RegisterCompanyForm'

export const AuthTabs = () => {
	return (
		<Tabs defaultValue='login' className='w-100'>
			<TabsList>
				<TabsTrigger value='login'>Login</TabsTrigger>
				<TabsTrigger value='reg'>Registration</TabsTrigger>
			</TabsList>

			<TabsContent value='login'>
				<Tabs defaultValue='user'>
					<TabsList>
						<TabsTrigger value='user'>User</TabsTrigger>
						<TabsTrigger value='company'>Company</TabsTrigger>
					</TabsList>
					<TabsContent value='user'>
						<LoginUserForm />
					</TabsContent>
					<TabsContent value='company'>
						<LoginCompanyForm />
					</TabsContent>
				</Tabs>
			</TabsContent>

			<TabsContent value='reg'>
				<Tabs defaultValue='user'>
					<TabsList>
						<TabsTrigger value='user'>User</TabsTrigger>
						<TabsTrigger value='company'>Company</TabsTrigger>
					</TabsList>
					<TabsContent value='user'>
						<RegisterUserForm />
					</TabsContent>
					<TabsContent value='company'>
						<RegisterCompanyForm />
					</TabsContent>
				</Tabs>
			</TabsContent>
		</Tabs>
	)
}
