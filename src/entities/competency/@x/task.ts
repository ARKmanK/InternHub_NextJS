// Публичный API компетенции специально для сущности task (cross-import по нотации @x из FSD)
export type { ICompetency } from '../model/ICompetency'
export { MAX_TASK_COMPETENCIES } from '../model/ICompetency'
export { CompetencyBadge } from '../ui/CompetencyBadge'
export { competencySelect, toCompetencyDto } from '../api/competencyMapper'
