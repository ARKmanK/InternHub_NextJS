import type { Prisma } from '@/shared/api'
import type { ICompetency } from '../model/ICompetency'

export const competencySelect = {
	id: true,
	code: true,
	nameRu: true,
	nameEn: true,
} satisfies Prisma.CompetencySelect

type CompetencyRow = Prisma.CompetencyGetPayload<{ select: typeof competencySelect }>

export const toCompetencyDto = (row: CompetencyRow): ICompetency => ({
	id: row.id,
	code: row.code,
	name: { ru: row.nameRu, en: row.nameEn },
})
