// Запускает локальную базу (prisma dev) в фоне так, чтобы команду можно было вызывать сколько угодно раз.
//
// Запущена ли база, проверяем подключением к порту из DATABASE_URL, а не по `prisma dev ls`:
// статус там обновляется с задержкой и может показывать not_running, когда база уже стартует и держит порты.
// Сразу после `db:stop` база ещё пару секунд держит lock-файл — поэтому несколько попыток с паузой.
import { execSync } from 'node:child_process'
import { closeSync, openSync, readFileSync } from 'node:fs'
import { connect } from 'node:net'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import nextEnv from '@next/env'

const NAME = 'internhub'
const ATTEMPTS = 10
const DELAY_MS = 2000

nextEnv.loadEnvConfig(process.cwd(), false, { info: () => {}, error: console.error })

const { hostname, port } = new URL(process.env.DATABASE_URL ?? '')
if (!port) {
	console.error('DATABASE_URL не задан или без порта — см. .env.example')
	process.exit(1)
}

const isDatabaseUp = () =>
	new Promise(resolve => {
		const socket = connect({ host: hostname, port: Number(port) })
		socket.setTimeout(1000)
		socket.once('connect', () => resolve(socket.end() && true))
		socket.once('timeout', () => resolve(socket.destroy() && false))
		socket.once('error', () => resolve(false))
	})

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

if (await isDatabaseUp()) {
	console.log(`База уже запущена: ${hostname}:${port}`)
	process.exit(0)
}

// Вывод prisma dev — в файл, а не в pipe: фоновый процесс базы наследует дескрипторы,
// и с pipe execSync ждал бы, пока база завершится (то есть вечно)
const logPath = join(tmpdir(), `prisma-dev-${NAME}.log`)

let lastError = ''
for (let attempt = 1; attempt <= ATTEMPTS; attempt++) {
	const log = openSync(logPath, 'w')
	try {
		execSync(`bunx prisma dev --name ${NAME} --detach`, { stdio: ['ignore', log, log] })
	} catch {
		lastError = readFileSync(logPath, 'utf8')
			.replace(/\x1b\[[0-9;]*m/g, '')
			.trim()
	} finally {
		closeSync(log)
	}

	if (await isDatabaseUp()) {
		console.log(`База запущена: ${hostname}:${port}`)
		process.exit(0)
	}
	await sleep(DELAY_MS)
}

console.error(`Не удалось запустить базу «${NAME}» на ${hostname}:${port}.`)
if (lastError) console.error(lastError.split('\n').slice(-5).join('\n'))
console.error(`Проверьте: bunx prisma dev ls — совпадают ли порты с DATABASE_URL в .env.local`)
process.exit(1)
