/**
 * Realtime-сервер InternHub: доставляет события (новое сообщение, новое уведомление)
 * в открытые вкладки по WebSocket.
 *
 *   браузер ──WS /ws?token=…──▶ realtime ◀──POST /publish (Bearer секрет)── Next (после коммита)
 *
 * Отдельный процесс, потому что route handlers Next не держат долгие соединения.
 * Ни базы, ни авторизации здесь нет: кто подключился — проверяет подписанный токен от приложения,
 * кому отправлять — говорит приложение. Сервер хранит только открытые соединения в памяти.
 * Для нескольких экземпляров понадобится общая шина (например Redis pub/sub) — сейчас один.
 *
 * Запуск: `bun run realtime` (переменные из .env.local).
 */
import { timingSafeEqual } from 'node:crypto'
import { createServer, type IncomingMessage, type ServerResponse } from 'node:http'
import { WebSocketServer, type WebSocket } from 'ws'
import { verifyRealtimeToken } from '../src/shared/api/realtime/token'

const PORT = Number(process.env.REALTIME_PORT ?? 3001)
const SECRET = process.env.REALTIME_SECRET
// Адрес приложения: браузер присылает его в Origin, чужие сайты не подключатся
const ALLOWED_ORIGIN = process.env.BETTER_AUTH_URL
const MAX_BODY_BYTES = 64 * 1024
const HEARTBEAT_MS = 30_000

if (!SECRET) {
	console.error('REALTIME_SECRET не задан — см. .env.example')
	process.exit(1)
}

/** Открытые соединения по пользователям: у одного человека может быть несколько вкладок. */
const sockets = new Map<string, Set<WebSocket>>()
const alive = new WeakSet<WebSocket>()

const isAuthorized = (header: string | undefined) => {
	const expected = Buffer.from(`Bearer ${SECRET}`)
	const actual = Buffer.from(header ?? '')
	return expected.length === actual.length && timingSafeEqual(expected, actual)
}

const readBody = (request: IncomingMessage) =>
	new Promise<string>((resolve, reject) => {
		let size = 0
		const chunks: Buffer[] = []
		request.on('data', (chunk: Buffer) => {
			size += chunk.length
			if (size > MAX_BODY_BYTES) {
				reject(new Error('too large'))
				request.destroy()
			} else chunks.push(chunk)
		})
		request.on('end', () => resolve(Buffer.concat(chunks).toString()))
		request.on('error', reject)
	})

const send = (response: ServerResponse, status: number, body?: object) => {
	response.writeHead(status, { 'Content-Type': 'application/json' })
	response.end(body ? JSON.stringify(body) : undefined)
}

/** POST /publish {userIds, event} — разослать событие всем вкладкам этих пользователей. */
const handlePublish = async (request: IncomingMessage, response: ServerResponse) => {
	if (!isAuthorized(request.headers.authorization)) return send(response, 401)

	let payload: { userIds?: unknown; event?: unknown }
	try {
		payload = JSON.parse(await readBody(request))
	} catch {
		return send(response, 400)
	}
	const { userIds, event } = payload
	if (!Array.isArray(userIds) || typeof event !== 'object' || event === null) {
		return send(response, 400)
	}

	const data = JSON.stringify(event)
	let delivered = 0
	for (const userId of userIds) {
		for (const socket of sockets.get(String(userId)) ?? []) {
			socket.send(data)
			delivered += 1
		}
	}
	send(response, 200, { delivered })
}

const server = createServer((request, response) => {
	if (request.method === 'POST' && request.url === '/publish') {
		handlePublish(request, response).catch(() => send(response, 500))
	} else if (request.method === 'GET' && request.url === '/health') {
		send(response, 200, {
			connections: [...sockets.values()].reduce((sum, set) => sum + set.size, 0),
		})
	} else {
		send(response, 404)
	}
})

const wss = new WebSocketServer({ noServer: true, maxPayload: 1024 })

server.on('upgrade', (request, socket, head) => {
	const url = new URL(request.url ?? '/', 'http://localhost')
	const origin = request.headers.origin
	const userId = verifyRealtimeToken(url.searchParams.get('token') ?? '', SECRET)

	const originAllowed = !ALLOWED_ORIGIN || origin === new URL(ALLOWED_ORIGIN).origin
	if (url.pathname !== '/ws' || !userId || !originAllowed) {
		socket.write('HTTP/1.1 401 Unauthorized\r\nConnection: close\r\n\r\n')
		socket.destroy()
		return
	}

	wss.handleUpgrade(request, socket, head, ws => {
		const userSockets = sockets.get(userId) ?? new Set()
		userSockets.add(ws)
		sockets.set(userId, userSockets)
		alive.add(ws)

		ws.on('pong', () => alive.add(ws))
		// Соединение только на приём: всё, что присылает клиент, игнорируем
		ws.on('message', () => {})
		ws.on('close', () => {
			userSockets.delete(ws)
			if (userSockets.size === 0) sockets.delete(userId)
		})
	})
})

// Пинг раз в 30 с: соединения, не ответившие с прошлого раза (уснувший ноутбук, обрыв сети), закрываются
const heartbeat = setInterval(() => {
	for (const ws of wss.clients) {
		if (!alive.has(ws)) {
			ws.terminate()
			continue
		}
		alive.delete(ws)
		ws.ping()
	}
}, HEARTBEAT_MS)

const shutdown = () => {
	clearInterval(heartbeat)
	for (const ws of wss.clients) ws.close(1001, 'server shutdown')
	server.close(() => process.exit(0))
}
process.on('SIGTERM', shutdown)
process.on('SIGINT', shutdown)

server.listen(PORT, () => console.log(`Realtime: ws://localhost:${PORT}/ws`))
