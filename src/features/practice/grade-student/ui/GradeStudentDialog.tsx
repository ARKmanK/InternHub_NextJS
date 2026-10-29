'use client'

import { useState, useTransition } from 'react'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'
import { Button } from '@/shared/ui/button'
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/shared/ui/dialog'
import { Field, FieldLabel } from '@/shared/ui/field'
import { Label } from '@/shared/ui/label'
import { RadioGroup, RadioGroupItem } from '@/shared/ui/radio-group'
import { Textarea } from '@/shared/ui/textarea'
import { PRACTICE_GRADES, PracticeGradeBadge, type PracticeGrade } from '@/entities/practice'
import { gradeStudentAction } from '../api/gradeStudentAction'

type GradeStudentDialogProps = {
	practiceId: number
	studentId: string
	studentName: string
	grade: PracticeGrade | null
	comment: string | null
}

/** Бейдж текущей оценки — он же кнопка, открывающая выставление оценки. */
export function GradeStudentDialog({
	practiceId,
	studentId,
	studentName,
	grade,
	comment,
}: GradeStudentDialogProps) {
	const t = useTranslations('GradeStudent')
	const tPractice = useTranslations('Practice')
	const tCommon = useTranslations('Common')
	const [open, setOpen] = useState(false)
	const [value, setValue] = useState<PracticeGrade | null>(grade)
	const [text, setText] = useState(comment ?? '')
	const [isPending, startTransition] = useTransition()

	const save = () =>
		startTransition(async () => {
			if (!value) return
			const result = await gradeStudentAction(practiceId, studentId, value, text)
			if (!result.ok) {
				toast.error(tCommon(result.error))
				return
			}
			toast.success(t('saved'))
			setOpen(false)
		})

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<button type='button' aria-label={t('open', { name: studentName })}>
					<PracticeGradeBadge grade={grade} />
				</button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{t('title', { name: studentName })}</DialogTitle>
				</DialogHeader>
				<RadioGroup
					value={value ?? ''}
					onValueChange={next => setValue(next as PracticeGrade)}
					className='grid grid-cols-2 gap-2'
				>
					{PRACTICE_GRADES.map(item => (
						<div key={item} className='flex items-center gap-2'>
							<RadioGroupItem value={item} id={`grade-${studentId}-${item}`} />
							<Label htmlFor={`grade-${studentId}-${item}`}>{tPractice(item)}</Label>
						</div>
					))}
				</RadioGroup>
				<Field>
					<FieldLabel htmlFor={`grade-comment-${studentId}`}>{t('comment')}</FieldLabel>
					<Textarea
						id={`grade-comment-${studentId}`}
						value={text}
						maxLength={2000}
						onChange={event => setText(event.target.value)}
					/>
				</Field>
				<DialogFooter>
					<DialogClose asChild>
						<Button variant='outline'>{tCommon('cancel')}</Button>
					</DialogClose>
					<Button disabled={isPending || !value} onClick={save}>
						{tCommon('save')}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
