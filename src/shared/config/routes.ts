/** Все адреса приложения в одном месте, чтобы не собирать строки руками по коду. */
export const routes = {
	home: () => '/',
	profile: () => '/profile',
	task: (id: number) => `/tasks/${id}`,
	taskCreate: () => '/tasks/new',
	taskEdit: (id: number) => `/tasks/${id}/edit`,
	taskArchive: (id: number) => `/api/files/tasks/${id}`,
	submissionFile: (id: number) => `/api/files/submissions/${id}`,
	studentPortfolio: (id: string) => `/students/${id}`,
	practiceCreate: () => '/practices/new',
	practice: (id: number) => `/practices/${id}`,
	practiceEdit: (id: number) => `/practices/${id}/edit`,
	practiceReport: (id: number) => `/api/practices/${id}/report`,
	forgotPassword: () => '/forgot-password',
	resetPassword: () => '/reset-password',
} as const
