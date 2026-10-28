import nextEnv from '@next/env'
import { defineConfig } from 'prisma/config'

// Prisma CLI сам не читает .env-файлы. Загружаем их так же, как это делает Next (.env, .env.local, ...),
// чтобы строка подключения хранилась в одном месте.
nextEnv.loadEnvConfig(process.cwd())

export default defineConfig({
	schema: 'prisma/schema.prisma',
	migrations: {
		path: 'prisma/migrations',
		seed: 'tsx prisma/seed.ts',
	},
	datasource: {
		url: process.env.DATABASE_URL,
		shadowDatabaseUrl: process.env.SHADOW_DATABASE_URL,
	},
})
