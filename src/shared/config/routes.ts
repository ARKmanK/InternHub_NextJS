/** Все адреса приложения в одном месте, чтобы не собирать строки руками по коду. */
export const routes = {
	home: () => '/',
	profile: () => '/profile',
	task: (id: number) => `/tasks/${id}`,
	taskCreate: () => '/tasks/new',
	taskEdit: (id: number) => `/tasks/${id}/edit`,
} as const
