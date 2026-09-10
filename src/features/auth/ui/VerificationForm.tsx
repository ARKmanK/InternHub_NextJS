'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Field, FieldLabel } from '@/components/ui/field'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp'
import { useState } from 'react'

export default function VerificationForm() {
	const [value, setValue] = useState('')
	const [apiError, setApiError] = useState<string | null>(null)
	const [isSuccess, setIsSuccess] = useState(false)
	const [isExpired, setIsExpired] = useState(false)

	const mutate = (val: string) => {
		alert(`Введенный код: ${val}`)
	}

	const handleInput = (val: string) => {
		setValue(val)
		if (val.length === 6) mutate(val)
	}

	const handleNewCode = () => {
		setValue('')
		setApiError(null)
		setIsExpired(false)
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>Two-Factor Authentication</CardTitle>
			</CardHeader>
			<CardContent>
				<Field>
					<FieldLabel>Enter the 6-digit code from the Google Authentication app</FieldLabel>
					<InputOTP maxLength={6} value={value} onChange={handleInput}>
						{[0, 1, 2, 3, 4, 5].map(index => (
							<InputOTPGroup key={index}>
								<InputOTPSlot index={index}></InputOTPSlot>
							</InputOTPGroup>
						))}
					</InputOTP>
				</Field>
				{apiError && <p>Invalid code</p>}
				{(isExpired || apiError) && !isSuccess && (
					<Button onClick={handleNewCode}>Get new code</Button>
				)}
			</CardContent>
		</Card>
	)
}
