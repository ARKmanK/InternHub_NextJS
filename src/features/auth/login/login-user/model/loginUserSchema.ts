import { z } from 'zod'

export const loginUserSchema = z.object({
	email: z.string().email({ message: 'Введите корректный email' }),
	password: z.string().min(8, { message: 'Пароль минимум 8 символов' }),
})

export type LoginUserFormData = z.infer<typeof loginUserSchema>
