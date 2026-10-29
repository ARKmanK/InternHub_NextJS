import type { ReactNode } from 'react'
import Link from 'next/link'
import { useFormatter, useTranslations } from 'next-intl'
import { CalendarRange } from 'lucide-react'
import {
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/shared/ui/card'
import type { IPractice } from '../model/IPractice'

type PracticeCardProps = {
	practice: IPractice
	href?: string
	action?: ReactNode
	children?: ReactNode
}

export function PracticeCard({ practice, href, action, children }: PracticeCardProps) {
	const t = useTranslations('Practice')
	const format = useFormatter()
	const range = format.dateTimeRange(new Date(practice.startsAt), new Date(practice.endsAt), {
		dateStyle: 'medium',
	})

	return (
		<Card>
			<CardHeader>
				<CardTitle>
					{href ? (
						<Link href={href} className='hover:underline'>
							{practice.title}
						</Link>
					) : (
						practice.title
					)}
				</CardTitle>
				<CardDescription className='flex flex-wrap items-center gap-x-3 gap-y-1'>
					<span className='flex items-center gap-1'>
						<CalendarRange className='size-4' /> {range}
					</span>
					<span>{t('teacher', { name: practice.teacherName })}</span>
					<span>{t('counts', { students: practice.studentCount, tasks: practice.taskCount })}</span>
				</CardDescription>
				{action && <CardAction>{action}</CardAction>}
			</CardHeader>
			{(practice.description || children) && (
				<CardContent className='flex flex-col gap-3'>
					{practice.description && (
						<p className='text-sm whitespace-pre-line text-muted-foreground'>
							{practice.description}
						</p>
					)}
					{children}
				</CardContent>
			)}
		</Card>
	)
}
