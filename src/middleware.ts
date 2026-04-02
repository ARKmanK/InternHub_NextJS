import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
	const token = request.cookies.get('token')?.value
	const cart = request.cookies.get('cart')?.value

	if (request.nextUrl.pathname.startsWith('/profile')) {
		if (!token) {
			return NextResponse.redirect(new URL('/', request.url))
		}
	}

	if (request.nextUrl.pathname.startsWith('/order')) {
		try {
			const cartData = cart ? JSON.parse(cart) : null
			if (!cartData?.products?.length) {
				return NextResponse.redirect(new URL('/', request.url))
			}
		} catch {
			return NextResponse.redirect(new URL('/', request.url))
		}
	}
	return NextResponse.next()
}

export const config = {
	matcher: ['/profile/:path*', '/order/:path*'],
}
