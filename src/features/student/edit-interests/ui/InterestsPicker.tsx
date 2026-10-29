'use client'

import { useOptimistic, useTransition } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { Check } from 'lucide-react'
import { toast } from 'sonner'
import type { Locale } from '@/shared/i18n'
import { Button } from '@/shared/ui/button'
import type { ICompetency } from '@/entities/competency'
import { updateInterestsAction } from '../api/updateInterestsAction'
import { MAX_INTERESTS } from '../model/interests'

type InterestsPickerProps = {
	options: ICompetency[]
	selected: number[]
}

/** Переключатели-чипы: каждое нажатие сразу сохраняется, интерфейс обновляется не дожидаясь сервера. */
export function InterestsPicker({ options, selected }: InterestsPickerProps) {
	const t = useTranslations('EditInterests')
	const tCommon = useTranslations('Common')
	const locale = useLocale() as Locale
	const [isPending, startTransition] = useTransition()
	const [optimistic, setOptimistic] = useOptimistic(selected)

	const toggle = (id: number) =>
		startTransition(async () => {
			const next = optimistic.includes(id)
				? optimistic.filter(value => value !== id)
				: [...optimistic, id]
			setOptimistic(next)
			const result = await updateInterestsAction(next)
			if (!result.ok) toast.error(tCommon(result.error))
		})

	return (
		<div className='flex flex-col gap-2'>
			<p className='text-sm text-muted-foreground'>{t('hint', { max: MAX_INTERESTS })}</p>
			<div className='flex flex-wrap gap-2' aria-busy={isPending}>
				{options.map(competency => {
					const isSelected = optimistic.includes(competency.id)
					return (
						<Button
							key={competency.id}
							type='button'
							size='sm'
							variant={isSelected ? 'default' : 'outline'}
							aria-pressed={isSelected}
							disabled={!isSelected && optimistic.length >= MAX_INTERESTS}
							onClick={() => toggle(competency.id)}
						>
							{isSelected && <Check />}
							{competency.name[locale]}
						</Button>
					)
				})}
			</div>
		</div>
	)
}
