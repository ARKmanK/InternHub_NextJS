import { useTranslations } from 'next-intl'
import { Download } from 'lucide-react'
import { routes } from '@/shared/config'
import { Button } from '@/shared/ui/button'

export function PracticeReportButton({ practiceId }: { practiceId: number }) {
	const t = useTranslations('PracticeReport')

	return (
		<Button asChild variant='outline' size='sm'>
			<a href={routes.practiceReport(practiceId)} download>
				<Download /> {t('download')}
			</a>
		</Button>
	)
}
