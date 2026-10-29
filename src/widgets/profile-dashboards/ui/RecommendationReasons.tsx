import { useLocale, useTranslations } from 'next-intl'
import { Sparkles } from 'lucide-react'
import type { Locale } from '@/shared/i18n'
import type { RecommendationReason } from '@/entities/task'

/** Строка «почему рекомендовано» под карточкой задания. */
export function RecommendationReasons({ reasons }: { reasons: RecommendationReason[] }) {
	const t = useTranslations('ProfileDashboards')
	const locale = useLocale() as Locale

	const text = reasons.map(reason => {
		switch (reason.type) {
			case 'interest':
				return t('reasonInterest', { name: reason.competency.name[locale] })
			case 'growth':
				return t('reasonGrowth', { name: reason.competency.name[locale] })
			case 'similar':
				return t('reasonSimilar', { tags: reason.tags.join(', ') })
			case 'level':
				return t('reasonLevel')
		}
	})

	return (
		<p className='flex items-start gap-1.5 px-1 text-sm text-muted-foreground'>
			<Sparkles className='mt-0.5 size-4 shrink-0' />
			<span>{text.join(' · ')}</span>
		</p>
	)
}
