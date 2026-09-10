import { z } from 'zod'

export const registerCompanySchema = z.object({
	companyName: z.string().min(3).max(50),
	email: z.string().email({ message: 'Введите корректный email' }),
	password: z.string().min(8, { message: 'Пароль минимум 8 символов' }),
})

export type RegisterCompanyFormData = z.infer<typeof registerCompanySchema>
