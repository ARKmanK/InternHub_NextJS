import { z } from 'zod'

export const inviteTeacherSchema = z.object({
	name: z.string().trim().min(2, { error: 'name' }).max(60, { error: 'name' }),
	email: z.email({ error: 'email' }),
})

export type InviteTeacherValues = z.infer<typeof inviteTeacherSchema>
