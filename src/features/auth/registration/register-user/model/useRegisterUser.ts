// features/auth/register-user/model/useRegisterUser.ts
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/features/api/supabase/client'

export const useRegisterUser = () => {
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const router = useRouter()

	const registerUser = async (data: {
		email: string
		password: string
		name: string
		surname: string
		group: string
		grade: string
	}) => {
		setIsLoading(true)
		setError(null)

		const supabase = createClient()

		const { data: authData, error: authError } = await supabase.auth.signUp({
			email: data.email,
			password: data.password,
			options: {
				data: {
					name: data.name,
					surname: data.surname,
					group: data.group,
					grade: data.grade,
					role: 'user',
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
		return { success: true, data: authData }
	}

	return { registerUser, isLoading, error }
}
