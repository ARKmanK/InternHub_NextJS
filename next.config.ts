import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./src/app/i18n/request.ts')

const nextConfig: NextConfig = {
	reactCompiler: true,
	poweredByHeader: false,
	experimental: {
		serverActions: {
			// Архив к заданию — до 50 МБ (src/shared/config/files.ts) плюс запас на остальные поля формы
			bodySizeLimit: '52mb',
		},
	},
}

export default withNextIntl(nextConfig)
