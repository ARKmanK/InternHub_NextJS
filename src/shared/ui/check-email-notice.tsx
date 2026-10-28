'use client'

import { useTranslations } from 'next-intl'
import { MailCheck } from 'lucide-react'
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from './empty'

/** Показывается после регистрации и запроса сброса пароля: дальше пользователь идёт по ссылке из письма. */
export function CheckEmailNotice({ email }: { email: string }) {
	const t = useTranslations('Common')

	return (
		<Empty className='border'>
			<EmptyHeader>
				<EmptyMedia variant='icon'>
					<MailCheck />
				</EmptyMedia>
				<EmptyTitle>{t('checkEmailTitle')}</EmptyTitle>
				<EmptyDescription>{t('checkEmailDescription', { email })}</EmptyDescription>
			</EmptyHeader>
		</Empty>
	)
}
