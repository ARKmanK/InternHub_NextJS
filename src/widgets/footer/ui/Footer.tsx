import { getTranslations } from 'next-intl/server'

export async function Footer() {
	const t = await getTranslations('Footer')

	return (
		<footer className='border-t'>
			<div className='mx-auto flex w-full max-w-6xl flex-col gap-1 px-4 py-6 text-sm text-muted-foreground sm:flex-row sm:justify-between'>
				<span>InternHub — {t('description')}</span>
				<span>
					© {new Date().getFullYear()} {t('university')}
				</span>
			</div>
		</footer>
	)
}
