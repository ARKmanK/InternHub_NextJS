// Ручной запуск еженедельных отчётов (то же, что делает cron на сервере): bun run reports:weekly
import nextEnv from '@next/env'

nextEnv.loadEnvConfig(process.cwd())

const { BETTER_AUTH_URL: baseUrl, CRON_SECRET: secret } = process.env
if (!secret) {
	console.error('Задайте CRON_SECRET в .env.local — см. .env.example')
	process.exit(1)
}

const response = await fetch(`${baseUrl}/api/cron/weekly-reports`, {
	method: 'POST',
	headers: { Authorization: `Bearer ${secret}` },
})
console.log(response.status, await response.text())
process.exit(response.ok ? 0 : 1)
