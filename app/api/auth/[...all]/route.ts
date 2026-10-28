import { toNextJsHandler } from 'better-auth/next-js'
import { auth } from '@/shared/api'

// HTTP-маршруты Better Auth: переходы по ссылкам из писем (подтверждение почты, сброс пароля), сессия и т.д.
export const { GET, POST } = toNextJsHandler(auth)
