import type { ReactNode } from 'react'
import { useFormatter, useTranslations } from 'next-intl'
import {
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/shared/ui/card'
import type { IOrganization } from '../model/IOrganization'

type OrganizationCardProps = {
	organization: IOrganization
	actions?: ReactNode
}

export function OrganizationCard({ organization, actions }: OrganizationCardProps) {
	const t = useTranslations('OrganizationCard')
	const format = useFormatter()

	return (
		<Card>
			<CardHeader>
				<CardTitle>{organization.name}</CardTitle>
				<CardDescription>
					{t('registered')}:{' '}
					{format.dateTime(new Date(organization.createdAt), { dateStyle: 'long' })}
				</CardDescription>
				{actions && <CardAction>{actions}</CardAction>}
			</CardHeader>
			<CardContent>
				<dl className='grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-sm'>
					<dt className='text-muted-foreground'>{t('inn')}</dt>
					<dd className='font-mono'>{organization.inn}</dd>
					<dt className='text-muted-foreground'>{t('ogrn')}</dt>
					<dd className='font-mono'>{organization.ogrn ?? '—'}</dd>
					<dt className='text-muted-foreground'>{t('contacts')}</dt>
					<dd>
						{organization.contacts.map(contact => (
							<div key={contact.email}>
								{contact.name},{' '}
								<a href={`mailto:${contact.email}`} className='underline'>
									{contact.email}
								</a>
							</div>
						))}
					</dd>
				</dl>
			</CardContent>
		</Card>
	)
}
