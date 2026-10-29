'use client'

import { useState, useTransition, type FormEvent } from 'react'
import { useTranslations } from 'next-intl'
import { UserPlus } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/shared/ui/button'
import { Field, FieldLabel } from '@/shared/ui/field'
import { Input } from '@/shared/ui/input'
import { RadioGroup, RadioGroupItem } from '@/shared/ui/radio-group'
import { Label } from '@/shared/ui/label'
import { Spinner } from '@/shared/ui/spinner'
import { addStudentsAction, type AddStudentsMode } from '../api/practiceStudentsActions'

export function AddStudentsForm({ practiceId }: { practiceId: number }) {
	const t = useTranslations('ManageStudents')
	const tCommon = useTranslations('Common')
	const [mode, setMode] = useState<AddStudentsMode>('group')
	const [value, setValue] = useState('')
	const [isPending, startTransition] = useTransition()

	const onSubmit = (event: FormEvent) => {
		event.preventDefault()
		startTransition(async () => {
			const result = await addStudentsAction(practiceId, mode, value)
			if (!result.ok) {
				toast.error(tCommon(result.error))
				return
			}
			if (result.data.added === 0) toast.info(t('nobody'))
			else toast.success(t('added', { count: result.data.added }))
			setValue('')
		})
	}

	return (
		<form onSubmit={onSubmit} className='flex flex-col gap-3'>
			<RadioGroup
				value={mode}
				onValueChange={next => setMode(next as AddStudentsMode)}
				className='flex gap-4'
			>
				{(['group', 'email'] as const).map(item => (
					<div key={item} className='flex items-center gap-2'>
						<RadioGroupItem value={item} id={`add-students-${item}`} />
						<Label htmlFor={`add-students-${item}`}>{t(`by_${item}`)}</Label>
					</div>
				))}
			</RadioGroup>
			<Field orientation='horizontal'>
				<FieldLabel htmlFor='add-students-value' className='sr-only'>
					{t(`by_${mode}`)}
				</FieldLabel>
				<Input
					id='add-students-value'
					value={value}
					type={mode === 'email' ? 'email' : 'text'}
					placeholder={t(`placeholder_${mode}`)}
					onChange={event => setValue(event.target.value)}
				/>
				<Button type='submit' disabled={isPending || value.trim().length < 2}>
					{isPending ? <Spinner /> : <UserPlus />} {t('add')}
				</Button>
			</Field>
		</form>
	)
}
