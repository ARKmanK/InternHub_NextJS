import 'server-only'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from './generated/client'

/**
 * Один экземпляр PrismaClient на всё приложение.
 * В режиме разработки Next перезагружает модули при каждой правке — без кэша в globalThis
 * каждый раз создавался бы новый пул соединений, и база быстро упёрлась бы в лимит подключений.
 *
 * `server-only` — сборка упадёт, если этот файл случайно импортируют в клиентский компонент.
 */
const createPrismaClient = () => {
	const connectionString = process.env.DATABASE_URL
	if (!connectionString) throw new Error('DATABASE_URL не задан — см. .env.example')

	// Размер пула соединений. Локальная база `prisma dev` (PGlite) держит только одно соединение —
	// при большем пуле параллельные запросы получают «Server has closed the connection»
	const max = Number(process.env.DATABASE_POOL_SIZE ?? 10)

	return new PrismaClient({
		adapter: new PrismaPg({ connectionString, max }),
		log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
	})
}

const globalForPrisma = globalThis as unknown as { prisma?: ReturnType<typeof createPrismaClient> }

export const db = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db
