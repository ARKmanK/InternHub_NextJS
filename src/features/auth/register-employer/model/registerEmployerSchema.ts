import { z } from 'zod'

/**
 * Регистрация представителя организации. Организация создаётся со статусом «на проверке»:
 * администратор сверяет ИНН/ОГРН, и только после этого сотрудники могут публиковать задания.
 */
export const registerEmployerSchema = z.object({
	contactName: z.string().trim().min(2, { error: 'name' }).max(60, { error: 'name' }),
	companyName: z
		.string()
		.trim()
		.min(2, { error: 'companyName' })
		.max(100, { error: 'companyName' }),
	// ИНН: 10 цифр у юрлица, 12 у ИП
	inn: z
		.string()
		.trim()
		.regex(/^(\d{10}|\d{12})$/, { error: 'inn' }),
	// ОГРН: 13 цифр у юрлица, 15 у ИП (ОГРНИП). Необязателен
	ogrn: z
		.string()
		.trim()
		.regex(/^(\d{13}|\d{15})?$/, { error: 'ogrn' }),
	email: z.email({ error: 'email' }),
	password: z.string().min(8, { error: 'password' }),
})

export type RegisterEmployerFormValues = z.infer<typeof registerEmployerSchema>
