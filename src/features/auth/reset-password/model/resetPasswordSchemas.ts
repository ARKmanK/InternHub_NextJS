import { z } from 'zod'

export const forgotPasswordSchema = z.object({
	email: z.email({ error: 'email' }),
})

export type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>

export const resetPasswordSchema = z
	.object({
		password: z.string().min(8, { error: 'password' }),
		confirmPassword: z.string(),
	})
	.refine(values => values.password === values.confirmPassword, {
		error: 'passwordsMismatch',
		path: ['confirmPassword'],
	})

export type ResetPasswordValues = z.infer<typeof resetPasswordSchema>
