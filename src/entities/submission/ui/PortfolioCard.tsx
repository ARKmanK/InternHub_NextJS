import Link from 'next/link'
import { useFormatter, useTranslations } from 'next-intl'
import { ExternalLink, Lock, Star } from 'lucide-react'
import { routes } from '@/shared/config'
import { Badge } from '@/shared/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card'
import type { IPortfolioItem } from '../model/IPortfolioItem'

export function PortfolioCard({ item }: { item: IPortfolioItem }) {
	const t = useTranslations('Portfolio')
	const format = useFormatter()

	return (
		<Card>
			<CardHeader>
				<CardTitle>
					<Link href={routes.task(item.taskId)} className='hover:underline'>
						{item.taskTitle}
					</Link>
				</CardTitle>
				<CardDescription className='flex flex-wrap items-center gap-2'>
					<span>{item.companyName}</span>
					{item.acceptedAt && (
						<span>· {format.dateTime(new Date(item.acceptedAt), { dateStyle: 'medium' })}</span>
					)}
					{item.ipTerms === 'nda' && (
						<Badge variant='outline'>
							<Lock /> NDA
						</Badge>
					)}
				</CardDescription>
			</CardHeader>
			<CardContent className='flex flex-col gap-3 text-sm'>
				{item.score !== null && (
					<div className='flex items-center gap-1' aria-label={t('score', { score: item.score })}>
						{[1, 2, 3, 4, 5].map(value => (
							<Star
								key={value}
								className='size-4'
								fill={value <= item.score! ? 'currentColor' : 'none'}
							/>
						))}
					</div>
				)}
				{item.tags.length > 0 && (
					<div className='flex flex-wrap gap-1'>
						{item.tags.map(tag => (
							<Badge key={tag} variant='secondary'>
								{tag}
							</Badge>
						))}
					</div>
				)}
				{item.reviewComment && (
					<blockquote className='border-l-2 pl-3 whitespace-pre-line text-muted-foreground'>
						{item.reviewComment}
					</blockquote>
				)}
				{item.repositoryUrl && (
					<a
						href={item.repositoryUrl}
						target='_blank'
						rel='noreferrer noopener'
						className='flex items-center gap-1 underline'
					>
						<ExternalLink className='size-4' /> {t('repository')}
					</a>
				)}
			</CardContent>
		</Card>
	)
}
