import { z } from 'zod'

export const registerUserSchema = z.object({
	email: z.string().email({ message: 'Введите корректный email' }),
	password: z.string().min(8, { message: 'Пароль минимум 8 символов' }),
	name: z.string().min(2).max(20),
	surname: z.string().min(2).max(20),
	group: z.string().min(2).max(20),
	grade: z.string(),
})

export type RegisterUserFormData = z.infer<typeof registerUserSchema>
