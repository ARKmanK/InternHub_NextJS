'use client'

import { useTransition } from 'react'
import { useTranslations } from 'next-intl'
import { UserMinus } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/shared/ui/button'
import { removeStudentAction } from '../api/practiceStudentsActions'

type RemoveStudentButtonProps = {
	practiceId: number
	studentId: string
	studentName: string
}

export function RemoveStudentButton({
	practiceId,
	studentId,
	studentName,
}: RemoveStudentButtonProps) {
	const t = useTranslations('ManageStudents')
	const tCommon = useTranslations('Common')
	const [isPending, startTransition] = useTransition()

	const remove = () => {
		if (!window.confirm(t('confirmRemove', { name: studentName }))) return
		startTransition(async () => {
			const result = await removeStudentAction(practiceId, studentId)
			if (!result.ok) toast.error(tCommon(result.error))
		})
	}

	return (
		<Button
			variant='ghost'
			size='icon-sm'
			disabled={isPending}
			aria-label={t('remove', { name: studentName })}
			onClick={remove}
		>
			<UserMinus />
		</Button>
	)
}
