import 'server-only'
import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { nextCookies } from 'better-auth/next-js'
import { db } from '../db'
import { sendMail } from '../mail'
import { existingAccountEmail, resetPasswordEmail, verificationEmail } from './emails'

/**
 * Better Auth: учётные записи, пароли (хэш scrypt), сессии в httpOnly-куке, подтверждение почты, сброс пароля.
 *
 * Роль пользователя Better Auth не знает и поменять не может: она хранится в users.role,
 * при регистрации студента остаётся значением по умолчанию, работодателю её назначает наш server action.
 *
 * Регистрация и вход идут через наши server actions (features/auth/*): там zod-валидация,
 * создание профиля и ограничение частоты запросов. Поэтому одноимённые HTTP-маршруты Better Auth
 * закрыты — иначе через них можно было бы создать пользователя без профиля в обход наших проверок.
 */
export const auth = betterAuth({
	database: prismaAdapter(db, { provider: 'postgresql', transaction: true }),
	secret: process.env.BETTER_AUTH_SECRET,
	baseURL: process.env.BETTER_AUTH_URL,
	disabledPaths: ['/sign-up/email', '/sign-in/email'],

	emailAndPassword: {
		enabled: true,
		requireEmailVerification: true,
		minPasswordLength: 8,
		revokeSessionsOnPasswordReset: true,
		sendResetPassword: async ({ user, url }) => {
			await sendMail(resetPasswordEmail(user.email, user.name, url))
		},
		// Регистрация на уже занятую почту не возвращает ошибку (чтобы нельзя было перебором узнать,
		// кто зарегистрирован) — вместо этого предупреждаем владельца почты
		onExistingUserSignUp: async ({ user }) => {
			await sendMail(
				existingAccountEmail(user.email, user.name, `${process.env.BETTER_AUTH_URL}/profile`),
			)
		},
	},

	emailVerification: {
		sendOnSignUp: true,
		// Пытается войти с неподтверждённой почтой — отправляем ссылку ещё раз
		sendOnSignIn: true,
		autoSignInAfterVerification: true,
		sendVerificationEmail: async ({ user, url }) => {
			await sendMail(verificationEmail(user.email, user.name, url))
		},
	},

	session: {
		expiresIn: 60 * 60 * 24 * 7, // неделя
		updateAge: 60 * 60 * 24, // продлевать раз в сутки при активности
	},

	// Ограничение частоты для HTTP-маршрутов Better Auth (подтверждение почты, сброс пароля и т.д.)
	rateLimit: { enabled: true, window: 60, max: 20 },

	// nextCookies — чтобы вызовы auth.api.* внутри server actions могли выставлять куки сессии
	plugins: [nextCookies()],
})
