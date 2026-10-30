import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./src/app/i18n/request.ts')

const nextConfig: NextConfig = {
	reactCompiler: true,
	poweredByHeader: false,
	// Минимальная сборка для Docker: server.js и только нужные node_modules (см. Dockerfile)
	output: 'standalone',
	// Исходники в образе не нужны — всё уже в собранных чанках
	outputFileTracingExcludes: { '*': ['src/**'] },
	logging: {
		// Next в dev печатает вызовы server actions вместе с аргументами — туда попадают пароли из форм входа
		serverFunctions: false,
	},
	experimental: {
		serverActions: {
			// Архив к заданию — до 50 МБ (src/shared/config/files.ts) плюс запас на остальные поля формы
			bodySizeLimit: '52mb',
		},
	},
}

export default withNextIntl(nextConfig)
