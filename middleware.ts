import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

const publicPaths = ["/", "/products", "/categories", "/about", "/contact", "/faq"]
const authPaths = ["/sign-in", "/sign-up"]

export async function middleware(request: NextRequest) {
    const token = await getToken({ req: request })
    const path = request.nextUrl.pathname
    const isAuthPage = authPaths.some((authPath) => path.startsWith(authPath))
    const isPublicPage = publicPaths.some((publicPath) => path.startsWith(publicPath))

    // Allow access to auth pages even if the user is authenticated
    if (isAuthPage) {
        return NextResponse.next()
    }

    if (!token && !isPublicPage) {
        return NextResponse.redirect(new URL("/sign-in", request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}

