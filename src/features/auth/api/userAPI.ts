import { IUser } from '@/entities/user/model/IUser'

/* export const createUser = async (userData: IUser) => {
	const { email, role, first_name, last_name, student_group, course, company_name } = userData

	const newUserData: IUser = {
		email,
		role,
		first_name,
		last_name,
		student_group,
		course,
		company_name: role === 'employer' ? company_name : undefined,
	}

	// Удаляем undefined значения
	(Object.keys(dataToInsert) as (keyof TypeUserData)[]).forEach(key => {
    if (dataToInsert[key] === undefined) {
      delete dataToInsert[key];
    }
  });

	const { data, error } = await supabase.from('users').insert(newUserData).select()

	if (error) {
		throw new Error(`Failed to create user: ${error.message}`)
	}

	// Сохраняем только существующие данные
	if (first_name) localStorage.setItem('first_name', first_name)
	if (last_name) localStorage.setItem('last_name', last_name)
	if (data && data[0]?.id) localStorage.setItem('userId', data[0].id.toString())
	localStorage.setItem('role', role)
}
 */

export function createUser(data: IUser) {}
