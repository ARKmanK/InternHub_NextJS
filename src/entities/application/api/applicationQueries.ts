import { ApplicationStatus, db, type Prisma } from '@/shared/api'
import type { IApplication } from '../model/IApplication'

const statusToDto = {
	[ApplicationStatus.PENDING]: 'pending',
	[ApplicationStatus.ACCEPTED]: 'accepted',
	[ApplicationStatus.DECLINED]: 'declined',
	[ApplicationStatus.WITHDRAWN]: 'withdrawn',
} as const satisfies Record<ApplicationStatus, IApplication['status']>

const applicationSelect = {
	id: true,
	taskId: true,
	studentId: true,
	message: true,
	status: true,
	createdAt: true,
	student: {
		select: {
			name: true,
			studentProfile: { select: { firstName: true, lastName: true, group: true, course: true } },
		},
	},
} satisfies Prisma.ApplicationSelect

type ApplicationRow = Prisma.ApplicationGetPayload<{ select: typeof applicationSelect }>

const toApplicationDto = (row: ApplicationRow): IApplication => {
	const profile = row.student.studentProfile
	return {
		id: row.id,
		taskId: row.taskId,
		studentId: row.studentId,
		studentName: profile ? `${profile.firstName} ${profile.lastName}` : row.student.name,
		studentGroup: profile?.group ?? null,
		studentCourse: profile?.course ?? null,
		message: row.message,
		status: statusToDto[row.status],
		createdAt: row.createdAt.toISOString(),
	}
}

// Вызываются только на сервере. Проверку, что смотрит автор задания, делает вызывающий код.

/** Заявки по заданию для его автора: сначала ожидающие решения. */
export async function getApplicationsByTask(taskId: number): Promise<IApplication[]> {
	const rows = await db.application.findMany({
		where: { taskId, status: { not: ApplicationStatus.WITHDRAWN } },
		select: applicationSelect,
		orderBy: [{ status: 'asc' }, { createdAt: 'asc' }],
	})
	return rows.map(toApplicationDto)
}

/** Заявка конкретного студента на задание (или null, если он её не подавал). */
export async function getStudentApplication(
	taskId: number,
	studentId: string,
): Promise<IApplication | null> {
	const row = await db.application.findUnique({
		where: { taskId_studentId: { taskId, studentId } },
		select: applicationSelect,
	})
	return row ? toApplicationDto(row) : null
}
