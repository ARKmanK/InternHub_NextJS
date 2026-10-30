import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'

const src = fileURLToPath(new URL('./src', import.meta.url))

/**
 * Юнит-тесты чистой логики: ранжирование, уровни, переходы статусов, схемы, CSV.
 * База в юнит-тестах не нужна: всё, что ходит в БД, проверяется через подставной клиент.
 */
export default defineConfig({
	resolve: {
		alias: [
			// В тестах из @/shared/api нужны только enum'ы Prisma — без подключения к базе, почты и авторизации
			{
				find: /^@\/shared\/api$/,
				replacement: `${src}/shared/api/db/generated/enums.ts`,
			},
			{ find: /^@\//, replacement: `${src}/` },
			{
				find: 'server-only',
				replacement: fileURLToPath(new URL('./test/server-only.ts', import.meta.url)),
			},
		],
	},
	test: {
		include: ['src/**/*.test.ts'],
		environment: 'node',
	},
})
