export interface IOrganization {
	id: number
	name: string
	inn: string
	ogrn: string | null
	status: 'pending' | 'verified' | 'rejected' | 'blocked'
	/** Кто зарегистрировал организацию — с ним администратор связывается при проверке */
	contacts: { name: string; email: string }[]
	createdAt: string
}
