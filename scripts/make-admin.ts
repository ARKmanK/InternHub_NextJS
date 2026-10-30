/**
 * Назначить администратора: bun run admin:make -- user@example.com
 * В production: docker compose run --rm migrate bun run admin:make -- user@example.com
 *
 * Сид создаёт администратора только для разработки. На сервере первый администратор
 * регистрируется как обычный пользователь (студент), подтверждает почту, затем этой командой
 * получает роль. Через интерфейс роль не меняется — назначить себя админом нельзя.
 */
import nextEnv from '@next/env'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient, UserRole } from '../src/shared/api/db/generated/client'

nextEnv.loadEnvConfig(process.cwd())

const email = process.argv[2]?.trim().toLowerCase()
if (!email) {
	console.error('Укажите почту: bun run admin:make -- user@example.com')
	process.exit(1)
}

const db = new PrismaClient({
	adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL, max: 1 }),
})

try {
	const user = await db.user.findUnique({
		where: { email },
		select: { id: true, emailVerified: true },
	})
	if (!user)
		throw new Error(`Пользователь ${email} не найден — сначала он должен зарегистрироваться`)
	if (!user.emailVerified) throw new Error(`Почта ${email} не подтверждена`)

	// Профили студента/работодателя администратору не нужны: доступ определяется ролью
	await db.$transaction([
		db.studentProfile.deleteMany({ where: { userId: user.id } }),
		db.user.update({ where: { id: user.id }, data: { role: UserRole.ADMIN } }),
		// Выйти на всех устройствах: новая роль подхватится при следующем входе
		db.session.deleteMany({ where: { userId: user.id } }),
	])
	console.log(`${email} теперь администратор`)
} catch (error) {
	console.error((error as Error).message)
	process.exitCode = 1
} finally {
	await db.$disconnect()
}
