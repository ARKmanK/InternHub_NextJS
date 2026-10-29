import { useTranslations } from 'next-intl'
import { Badge } from '@/shared/ui/badge'
import type { PracticeGrade } from '../model/IPractice'

export function PracticeGradeBadge({ grade }: { grade: PracticeGrade | null }) {
	const t = useTranslations('Practice')
	if (!grade) return <Badge variant='outline'>{t('noGrade')}</Badge>

	return (
		<Badge variant={grade === 'unsatisfactory' ? 'destructive' : 'secondary'}>{t(grade)}</Badge>
	)
}
