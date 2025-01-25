import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })

    const isAuthPage = request.nextUrl.pathname.startsWith('/sign-in') ||
        request.nextUrl.pathname.startsWith('/sign-up')

    if (isAuthPage) {
        if (token) {
            return NextResponse.redirect(new URL('/', request.url))
        }
        return NextResponse.next()
    }

    if (!token) {
        let from = request.nextUrl.pathname;
        if (request.nextUrl.search) {
            from += request.nextUrl.search;
        }

        return NextResponse.redirect(
            new URL(`/sign-in?from=${encodeURIComponent(from)}`, request.url)
        );
    }

    return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
    matcher: ['/dashboard/:path*', '/sign-in', '/sign-up'],
}
