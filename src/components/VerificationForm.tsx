'use client'

import { memo, useEffect, useRef } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'
import { ArrowLeft, Circle } from 'lucide-react'
import { Button } from './ui/button'
import { IVerifyOTPResponse, verifyOTP } from '@/lib/mocks'
import { InputOTP, InputOTPGroup, InputOTPSlot } from './ui/input-otp'

const VerificationForm = () => {
	const [value, setValue] = useState('')
	const [apiError, setApiError] = useState<string | null>(null)
	const [isSuccess, setIsSuccess] = useState(false)
	const [isExpired, setIsExpired] = useState(false)
	const timerRef = useRef<NodeJS.Timeout | null>(null)

	const { mutate } = useMutation<IVerifyOTPResponse, Error, string>({
		mutationFn: otp => verifyOTP(otp),
		onSuccess: data => {
			if (data.success) {
				if (timerRef.current) {
					clearTimeout(timerRef.current)
				}
				setIsSuccess(true)
				console.log('Успешная проверка OTP! Токен:', data.token)
			} else {
				setApiError(data.error || 'Произошла ошибка при проверке OTP.')
				startTimer()
			}
		},
		onError: (err: Error) => {
			setApiError(err.message)
			startTimer()
		},
	})

	const startTimer = () => {
		if (timerRef.current) {
			clearTimeout(timerRef.current)
		}
		timerRef.current = setTimeout(() => {
			if (!isSuccess) {
				setIsExpired(true)
			}
		}, 5000)
	}

	useEffect(() => {
		startTimer()
		return () => {
			if (timerRef.current) {
				clearTimeout(timerRef.current)
			}
		}
	}, [])

	const handleChange = (val: string) => {
		setValue(val)
		setApiError(null)
		if (val.length === 6) {
			mutate(val)
		}
	}

	const handleGetNewCode = () => {
		if (timerRef.current) {
			clearTimeout(timerRef.current)
		}
		setIsExpired(false)
		setValue('')
		setApiError(null)
		startTimer()
	}

	return (
		<div className='space-y-4 bg-white rounded-[10px] text-black p-6 shadow-2xl max-w-md mx-auto relative'>
			<a href='/' className='absolute left-6 top-6'>
				<ArrowLeft size={20} />
			</a>
			<div className='flex flex-col items-center'>
				<p className='flex font-semibold justify-center my-4'>
					<Circle size={26} color='#1677ff' strokeWidth={4} className='mr-2' />
					Company
				</p>
				<p className='w-[80%] text-2xl font-semibold text-center'>Two-Factor Authentication</p>
			</div>
			<div className='flex flex-col items-center mb-8'>
				<p className='w-[80%] text-center'>
					Enter the 6-digit code from the Google Authentication app
				</p>
			</div>
			<div className='w-[88%] mx-auto'>
				{apiError && (
					<div className='p-3 bg-red-100 text-red-600 rounded-md text-center mb-4'>{apiError}</div>
				)}
				<div className='space-y-2 flex flex-col items-center'>
					<InputOTP maxLength={6} value={value} onChange={handleChange}>
						{[0, 1, 2, 3, 4, 5].map(index => (
							<InputOTPGroup key={index}>
								<InputOTPSlot
									index={index}
									className={`border-2 ${apiError ? 'border-red-500' : 'border-gray-300'}`}
								/>
							</InputOTPGroup>
						))}
					</InputOTP>
				</div>
				{apiError && <p className='text-red-500 text-sm mt-2'>Invalid code</p>}
			</div>
			{(isExpired || apiError) && !isSuccess && (
				<div className='flex justify-center'>
					<Button onClick={handleGetNewCode} className='w-[88%] bg-[#1677ff] text-white py-4'>
						Get new code
					</Button>
				</div>
			)}
			{isSuccess && (
				<div className='flex justify-center'>
					<Button onClick={() => alert('Вход успешен')} className='w-[85%] bg-[#1677ff] text-white'>
						Continue
					</Button>
				</div>
			)}
		</div>
	)
}

export default memo(VerificationForm)
