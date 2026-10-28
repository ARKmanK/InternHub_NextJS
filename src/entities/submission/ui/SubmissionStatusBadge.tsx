import { useTranslations } from 'next-intl'
import { Ban, CircleCheck, FilePen, Hourglass, RotateCcw, type LucideIcon } from 'lucide-react'
import { Badge } from '@/shared/ui/badge'
import type { SubmissionStatus } from '../model/ISubmission'

const icons: Record<SubmissionStatus, LucideIcon> = {
	draft: FilePen,
	submitted: Hourglass,
	changes_requested: RotateCcw,
	accepted: CircleCheck,
	rejected: Ban,
}

export function SubmissionStatusBadge({ status }: { status: SubmissionStatus }) {
	const t = useTranslations('SubmissionStatus')
	const Icon = icons[status]

	return (
		<Badge variant={status === 'rejected' ? 'destructive' : 'outline'}>
			<Icon /> {t(status)}
		</Badge>
	)
}
