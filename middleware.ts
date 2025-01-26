import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

// Define protected routes (routes that require authentication)
const protectedPaths = ["/dashboard", "/profile", "/settings"] // Add your protected routes here

export async function middleware(request: NextRequest) {
    const token = await getToken({ req: request })
    const path = request.nextUrl.pathname

    // Allow access to NextAuth API routes and auth pages (sign-in, sign-up)
    if (request.nextUrl.pathname.startsWith("/api/auth")) {
        return NextResponse.next()
    }
    if (path.startsWith("/api/auth") || path.startsWith("/sign-in") || path.startsWith("/sign-up")) {
        return NextResponse.next()
    }

    // Check if the current route is a protected route
    const isProtectedRoute = protectedPaths.some((protectedPath) => path.startsWith(protectedPath))

    // Redirect to sign-in page if the user is not authenticated and trying to access a protected route
    if (!token && isProtectedRoute) {
        return NextResponse.redirect(new URL("/sign-in", request.url))
    }

    // Allow access to all other routes (public routes)
    return NextResponse.next()
}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}

