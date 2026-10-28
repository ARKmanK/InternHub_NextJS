import { z } from 'zod'

export const STUDENT_COURSES = ['1', '2', '3', '4', '5', '6'] as const

export const registerStudentSchema = z.object({
	firstName: z.string().trim().min(2, { error: 'name' }).max(30, { error: 'name' }),
	lastName: z.string().trim().min(2, { error: 'name' }).max(30, { error: 'name' }),
	group: z.string().trim().min(2, { error: 'group' }).max(20, { error: 'group' }),
	course: z.enum(STUDENT_COURSES, { error: 'course' }),
	email: z.email({ error: 'email' }),
	password: z.string().min(8, { error: 'password' }),
})

export type RegisterStudentFormValues = z.infer<typeof registerStudentSchema>
