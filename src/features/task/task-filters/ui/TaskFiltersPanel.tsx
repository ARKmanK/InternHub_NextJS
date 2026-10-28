'use client'

import { useTransition } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { Button } from '@/shared/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/shared/ui/card'
import { Checkbox } from '@/shared/ui/checkbox'
import { Field, FieldLabel, FieldLegend, FieldSet } from '@/shared/ui/field'
import { Label } from '@/shared/ui/label'
import { RadioGroup, RadioGroupItem } from '@/shared/ui/radio-group'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select'
import type { TaskFilterOptions, TaskFilters } from '@/entities/task'

type TaskFiltersPanelProps = {
	filters: TaskFilters
	options: TaskFilterOptions
}

const ANY = 'any'

const difficulties = [
	{ value: '1', label: 'lvl1' },
	{ value: '2', label: 'lvl2' },
	{ value: '3', label: 'lvl3' },
] as const

const toSearchParams = (filters: TaskFilters) => {
	const params = new URLSearchParams()
	if (filters.difficulty) params.set('difficulty', filters.difficulty)
	if (filters.company) params.set('company', filters.company)
	if (filters.tags.length > 0) params.set('tags', filters.tags.join(','))
	return params
}

/** Фильтр ничего не хранит у себя: значения приходят из URL (через сервер) и пишутся обратно в URL. */
export function TaskFiltersPanel({ filters, options }: TaskFiltersPanelProps) {
	const t = useTranslations('TaskFilters')
	const router = useRouter()
	// null бывает только в Pages Router — у нас App Router, но тип общий
	const pathname = usePathname() ?? '/'
	const [isPending, startTransition] = useTransition()

	const navigate = (next: TaskFilters) => {
		const query = toSearchParams(next).toString()
		startTransition(() =>
			router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false }),
		)
	}

	const toggleTag = (tag: string, checked: boolean) => {
		const tags = checked ? [...filters.tags, tag] : filters.tags.filter(item => item !== tag)
		navigate({ ...filters, tags })
	}

	const reset = () => navigate({ tags: [] })

	return (
		<Card aria-busy={isPending}>
			<CardHeader>
				<CardTitle>{t('title')}</CardTitle>
			</CardHeader>
			<CardContent className='flex flex-col gap-6'>
				<FieldSet>
					<FieldLegend variant='label'>{t('difficulty')}</FieldLegend>
					<RadioGroup
						value={filters.difficulty ?? ANY}
						onValueChange={value =>
							navigate({
								...filters,
								difficulty: value === ANY ? undefined : (value as TaskFilters['difficulty']),
							})
						}
					>
						{[{ value: ANY, label: 'anyDifficulty' } as const, ...difficulties].map(
							({ value, label }) => (
								<div key={value} className='flex items-center gap-2'>
									<RadioGroupItem value={value} id={`filter-difficulty-${value}`} />
									<Label htmlFor={`filter-difficulty-${value}`}>{t(label)}</Label>
								</div>
							),
						)}
					</RadioGroup>
				</FieldSet>

				<Field>
					<FieldLabel htmlFor='filter-company'>{t('company')}</FieldLabel>
					<Select
						value={filters.company ?? ANY}
						onValueChange={value =>
							navigate({ ...filters, company: value === ANY ? undefined : value })
						}
					>
						<SelectTrigger id='filter-company' className='w-full'>
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value={ANY}>{t('anyCompany')}</SelectItem>
							{options.companies.map(company => (
								<SelectItem key={company.id} value={String(company.id)}>
									{company.name}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</Field>

				<FieldSet>
					<FieldLegend variant='label'>{t('tags')}</FieldLegend>
					{options.tags.length === 0 ? (
						<p className='text-sm text-muted-foreground'>{t('noTags')}</p>
					) : (
						options.tags.map(tag => (
							<div key={tag} className='flex items-center gap-2'>
								<Checkbox
									id={`filter-tag-${tag}`}
									checked={filters.tags.includes(tag)}
									onCheckedChange={checked => toggleTag(tag, checked === true)}
								/>
								<Label htmlFor={`filter-tag-${tag}`}>{tag}</Label>
							</div>
						))
					)}
				</FieldSet>
			</CardContent>
			<CardFooter>
				<Button variant='outline' className='flex-1' onClick={reset}>
					{t('reset')}
				</Button>
			</CardFooter>
		</Card>
	)
}
