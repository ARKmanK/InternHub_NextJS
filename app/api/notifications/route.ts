import { getUnreadNotifications } from '@/entities/notification/index.server'
import { getCurrentUser } from '@/entities/user/index.server'

// Непрочитанные уведомления текущего пользователя — колокольчик опрашивает этот адрес
export async function GET() {
	const user = await getCurrentUser()
	if (!user) return Response.json([], { status: 401 })

	return Response.json(await getUnreadNotifications(user.id), {
		headers: { 'Cache-Control': 'private, no-store' },
	})
}
