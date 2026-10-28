/** Заявка студента на выполнение задания: работодатель её принимает или отклоняет. */
export const APPLICATION_STATUSES = ['pending', 'accepted', 'declined', 'withdrawn'] as const

export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number]

export interface IApplication {
	id: number
	taskId: number
	studentId: string
	studentName: string
	/** Группа и курс — работодателю полезно видеть, кто подаёт заявку */
	studentGroup: string | null
	studentCourse: number | null
	message: string | null
	status: ApplicationStatus
	createdAt: string
}
