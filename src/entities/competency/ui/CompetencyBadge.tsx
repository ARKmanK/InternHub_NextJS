import { useLocale } from 'next-intl'
import type { Locale } from '@/shared/i18n'
import { Badge } from '@/shared/ui/badge'
import type { ICompetency } from '../model/ICompetency'

export function CompetencyBadge({ competency }: { competency: ICompetency }) {
	const locale = useLocale() as Locale
	return <Badge variant='outline'>{competency.name[locale]}</Badge>
}
