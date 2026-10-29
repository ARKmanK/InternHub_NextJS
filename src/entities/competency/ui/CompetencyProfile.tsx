import { useLocale, useTranslations } from 'next-intl'
import type { Locale } from '@/shared/i18n'
import { cn } from 'cn'
import { LEVEL_THRESHOLDS } from '../model/competencyLevel'
import type { IStudentCompetency } from '../model/ICompetency'

const levelBars = { basic: 1, confident: 2, advanced: 3 } as const

/** Профиль подтверждённых компетенций: уровень полосками и из чего он сложился. */
export function CompetencyProfile({ items }: { items: IStudentCompetency[] }) {
	const t = useTranslations('Competency')
	const locale = useLocale() as Locale

	if (items.length === 0) return <p className='text-sm text-muted-foreground'>{t('empty')}</p>

	return (
		<div className='flex flex-col gap-2'>
			<ul className='grid gap-3 sm:grid-cols-2'>
				{items.map(item => (
					<li key={item.competency.id} className='flex flex-col gap-1 rounded-lg border p-3'>
						<div className='flex items-center justify-between gap-2'>
							<span className='font-medium'>{item.competency.name[locale]}</span>
							<span className='text-sm text-muted-foreground'>{t(item.level)}</span>
						</div>
						<div className='flex gap-1' aria-hidden>
							{[1, 2, 3].map(bar => (
								<span
									key={bar}
									className={cn(
										'h-1.5 flex-1 rounded-full',
										bar <= levelBars[item.level] ? 'bg-primary' : 'bg-muted',
									)}
								/>
							))}
						</div>
						<span className='text-xs text-muted-foreground'>
							{t('confirmedBy', { count: item.tasksCount })}
							{item.averageScore !== null &&
								` · ${t('averageScore', { score: item.averageScore.toFixed(1) })}`}
						</span>
					</li>
				))}
			</ul>
			<p className='text-xs text-muted-foreground'>{t('levelHint', LEVEL_THRESHOLDS)}</p>
		</div>
	)
}
