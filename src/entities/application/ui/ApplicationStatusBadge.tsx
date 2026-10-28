import { useTranslations } from 'next-intl'
import { Ban, CircleCheck, Hourglass, Undo2, type LucideIcon } from 'lucide-react'
import { Badge } from '@/shared/ui/badge'
import type { ApplicationStatus } from '../model/IApplication'

const icons: Record<ApplicationStatus, LucideIcon> = {
	pending: Hourglass,
	accepted: CircleCheck,
	declined: Ban,
	withdrawn: Undo2,
}

export function ApplicationStatusBadge({ status }: { status: ApplicationStatus }) {
	const t = useTranslations('ApplicationStatus')
	const Icon = icons[status]

	return (
		<Badge variant={status === 'declined' ? 'destructive' : 'outline'}>
			<Icon /> {t(status)}
		</Badge>
	)
}
