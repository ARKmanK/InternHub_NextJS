'use client'

import { memo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Building2, Undo2, User } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { StudentForm, StudentFormData, studentSchema } from './StudentForm'
import { CompanyForm, CompanyFormData, companySchema } from './CompanyForm'
import { UserType } from '@/types/UserType'
import Link from 'next/link'
import { cn } from '@/lib/utils'

const RegistrationForm = () => {
	const [userType, setUserType] = useState<UserType>('student')

	const handleTabChange = (value: string) => {
		setUserType(value as UserType)
	}

	return (
		<div className='w-full max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg'>
			<div className='pb-2.5'>
				<Link href='/' className='flex w-fit p-3 pl-0 pt-0'>
					<Undo2 size={20} className='mr-2' />
					<span className='flex-initial'>Вернуться</span>
				</Link>
			</div>

			<Tabs value={userType} onValueChange={handleTabChange} className='w-full'>
				<TabsList className='relative w-full !h-10 bg-gray-300 rounded-full p-1 mb-8'>
					<div
						className='absolute top-[3px] h-[34px] bg-[#ff6900] rounded-full transition-transform duration-300 ease-in-out'
						style={{
							width: 'calc(50% - 5px)',
							left: '3px',
							transform: `translateX(${userType === 'student' ? '0' : 'calc(100% + 4px)'})`,
						}}
					/>

					<TabsTrigger
						value='student'
						className={cn(
							'relative z-10 flex-1 h-full flex items-center justify-center gap-2 font-semibold transition-colors duration-300',
							'!bg-transparent !border-none !shadow-none',
							userType === 'student' ? 'text-white' : 'text-black',
						)}
					>
						<User className='w-4 h-4' />
						Студент
					</TabsTrigger>

					<TabsTrigger
						value='company'
						className={cn(
							'relative z-10 flex-1 h-full flex items-center justify-center gap-2 font-semibold transition-colors duration-300',
							'!bg-transparent !border-none !shadow-none',
							userType === 'company' ? 'text-white' : 'text-black',
						)}
					>
						<Building2 className='w-4 h-4' />
						Компания
					</TabsTrigger>
				</TabsList>

				<TabsContent value='student' className='w-100 m-0 data-[state=active]:mt-0'>
					<StudentForm />
				</TabsContent>

				<TabsContent value='company' className='w-100 m-0 data-[state=active]:mt-0'>
					<CompanyForm />
				</TabsContent>
			</Tabs>
		</div>
	)
}

export default memo(RegistrationForm)
