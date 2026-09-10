import { createServerClient } from '@supabase/ssr'
import { NextRequest, NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
	const token = request.cookies.get('token')?.value
	const cart = request.cookies.get('cart')?.value

	if (request.nextUrl.pathname.startsWith('/admin')) {
		if (!token) {
			return NextResponse.redirect(new URL('/', request.url))
		}
	}

	let response = NextResponse.next({
		request: { headers: request.headers },
	})

	const supabase = createServerClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
		{
			cookies: {
				getAll() {
					return request.cookies.getAll()
				},
				setAll(cookiesToSet) {
					cookiesToSet.forEach(({ name, value, options }) => {
						response.cookies.set(name, value, options)
					})
				},
			},
		},
	)
	await supabase.auth.getUser()
	//return NextResponse.next()
}

export const config = {
	//matcher: ['/profile/:path*', '/order/:path*'.],
	matcher: ['/:path*', '/admin:path*'],
}
