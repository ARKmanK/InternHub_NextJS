'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/features/api/supabase/client'

export const useLoginUser = () => {
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const router = useRouter()

	const login = async (email: string, password: string) => {
		setIsLoading(true)
		setError(null)

		const supabase = createClient()
		const { error: authError } = await supabase.auth.signInWithPassword({
			email,
			password,
		})

		if (authError) {
			setError(authError.message)
			setIsLoading(false)
			return { success: false, error: authError.message }
		}

		router.push('/profile')
		router.refresh()
		return { success: true }
	}

	return { login, isLoading, error }
}
