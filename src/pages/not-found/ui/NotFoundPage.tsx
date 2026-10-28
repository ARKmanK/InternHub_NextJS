import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { FileQuestion } from 'lucide-react'
import { routes } from '@/shared/config'
import { Button } from '@/shared/ui/button'
import {
	Empty,
	EmptyContent,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from '@/shared/ui/empty'

export async function NotFoundPage() {
	const t = await getTranslations('NotFoundPage')

	return (
		<Empty>
			<EmptyHeader>
				<EmptyMedia variant='icon'>
					<FileQuestion />
				</EmptyMedia>
				<EmptyTitle>{t('title')}</EmptyTitle>
				<EmptyDescription>{t('description')}</EmptyDescription>
			</EmptyHeader>
			<EmptyContent>
				<Button asChild>
					<Link href={routes.home()}>{t('home')}</Link>
				</Button>
			</EmptyContent>
		</Empty>
	)
}
