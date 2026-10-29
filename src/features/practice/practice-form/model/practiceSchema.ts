import { z } from 'zod'

/**
 * Даты — строки yyyy-mm-dd из <input type="date">: календарный день без времени,
 * поэтому не «съезжает» из-за часового пояса (в базе колонки типа DATE).
 */
export const practiceSchema = z
	.object({
		title: z
			.string()
			.trim()
			.min(3, { error: 'practiceTitle' })
			.max(100, { error: 'practiceTitle' }),
		description: z.string().trim().max(2000, { error: 'longText' }),
		startsAt: z.iso.date({ error: 'date' }),
		endsAt: z.iso.date({ error: 'date' }),
	})
	.refine(values => values.endsAt >= values.startsAt, {
		error: 'dateRange',
		path: ['endsAt'],
	})

export type PracticeValues = z.infer<typeof practiceSchema>

export const emptyPractice: PracticeValues = {
	title: '',
	description: '',
	startsAt: '',
	endsAt: '',
}

/** yyyy-mm-dd → Date в полночь UTC: так Prisma запишет в колонку DATE ровно этот день */
export const toDbDate = (value: string) => new Date(`${value}T00:00:00Z`)
