'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/features/api/supabase/client'

type RegisterCompanyData = {
	companyName: string
	email: string
	password: string
}

export const useRegisterCompany = () => {
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const router = useRouter()

	const registerCompany = async (data: RegisterCompanyData) => {
		setIsLoading(true)
		setError(null)

		const supabase = createClient()
		const { data: authData, error: authError } = await supabase.auth.signUp({
			email: data.email,
			password: data.password,
			options: {
				data: {
					companyName: data.companyName,
					role: 'company',
				},
			},
		})

		if (authError) {
			setError(authError.message)
			setIsLoading(false)
			return { success: false, error: authError.message }
		}

		router.push('/profile')
		router.refresh()
		setIsLoading(false)
		return { success: true, data: authData }
	}

	return { registerCompany, isLoading, error }
}
