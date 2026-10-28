import { z } from 'zod'

/**
 * Регистрация представителя компании. Верификация организации (ИНН/ОГРН, проверка админом)
 * добавляется на этапе 2 — до неё работодатель не может публиковать задания.
 */
export const registerEmployerSchema = z.object({
	companyName: z
		.string()
		.trim()
		.min(2, { error: 'companyName' })
		.max(100, { error: 'companyName' }),
	email: z.email({ error: 'email' }),
	password: z.string().min(8, { error: 'password' }),
})

export type RegisterEmployerFormValues = z.infer<typeof registerEmployerSchema>
