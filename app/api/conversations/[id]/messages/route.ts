import { getMessages } from '@/entities/conversation/index.server'
import { getCurrentUser } from '@/entities/user/index.server'

// История чата постранично: ?before=<id> — сообщения раньше этого. Только участникам
export async function GET(
	request: Request,
	{ params }: RouteContext<'/api/conversations/[id]/messages'>,
) {
	const id = Number((await params).id)
	const before = Number(new URL(request.url).searchParams.get('before'))
	if (!Number.isInteger(id)) return new Response('Not Found', { status: 404 })

	const user = await getCurrentUser()
	if (!user) return new Response(null, { status: 401 })

	const page = await getMessages(
		id,
		user.id,
		Number.isInteger(before) && before > 0 ? before : undefined,
	)
	if (!page) return new Response('Not Found', { status: 404 })

	return Response.json(page, { headers: { 'Cache-Control': 'private, no-store' } })
}
