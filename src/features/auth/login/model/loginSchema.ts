import { z } from 'zod'

export const loginSchema = z.object({
	email: z.email({ error: 'email' }),
	password: z.string().min(8, { error: 'password' }),
})

export type LoginFormValues = z.infer<typeof loginSchema>
