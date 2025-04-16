import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })

    const isAuthPage = request.nextUrl.pathname.startsWith("/login")
    
    if (!token && !isAuthPage) {
        console.log("!token && !isAuthPage")
        return NextResponse.redirect(new URL("/login", request.url))
    }

    if (token && isAuthPage) {
        console.log("token && isAuthPage")
        return NextResponse.redirect(new URL("/dashboard", request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: ["/dashboard/:path*", "/login"]
}