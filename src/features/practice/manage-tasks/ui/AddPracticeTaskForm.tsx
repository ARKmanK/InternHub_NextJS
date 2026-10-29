'use client'

import { useState, useTransition } from 'react'
import { useTranslations } from 'next-intl'
import { Plus } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/shared/ui/button'
import { Field } from '@/shared/ui/field'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select'
import { Spinner } from '@/shared/ui/spinner'
import { addPracticeTaskAction } from '../api/practiceTasksActions'

type AddPracticeTaskFormProps = {
	practiceId: number
	/** Опубликованные задания, которых ещё нет в практике */
	options: { id: number; title: string; companyName: string }[]
}

export function AddPracticeTaskForm({ practiceId, options }: AddPracticeTaskFormProps) {
	const t = useTranslations('ManageTasks')
	const tCommon = useTranslations('Common')
	const [taskId, setTaskId] = useState('')
	const [isPending, startTransition] = useTransition()

	if (options.length === 0) return <p className='text-sm text-muted-foreground'>{t('noOptions')}</p>

	const add = () =>
		startTransition(async () => {
			const result = await addPracticeTaskAction(practiceId, Number(taskId))
			if (!result.ok) {
				toast.error(tCommon(result.error))
				return
			}
			setTaskId('')
		})

	return (
		<Field orientation='horizontal'>
			<Select value={taskId} onValueChange={setTaskId}>
				<SelectTrigger className='w-full' aria-label={t('choose')}>
					<SelectValue placeholder={t('choose')} />
				</SelectTrigger>
				<SelectContent>
					{options.map(option => (
						<SelectItem key={option.id} value={String(option.id)}>
							{option.title} — {option.companyName}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
			<Button disabled={isPending || !taskId} onClick={add}>
				{isPending ? <Spinner /> : <Plus />} {t('add')}
			</Button>
		</Field>
	)
}
