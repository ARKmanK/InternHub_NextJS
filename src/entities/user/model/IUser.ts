export interface IUser {
	id: number
	email: string
	role: 'user' | 'employer' | 'admin'
	first_name?: string
	last_name?: string
	student_group?: string
	course?: number
	company_name?: string
	created_at?: string
}
