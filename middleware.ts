import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
    const session = request.cookies.get("auth_session");

    if (!session) {
        if (request.nextUrl.pathname.startsWith("/dashboard") || request.nextUrl.pathname.startsWith("/profile")) {
            return NextResponse.redirect(new URL("/login", request.url));
        }

        return NextResponse.next();
    }

    if (session) {
        if (request.nextUrl.pathname.startsWith("/login") || request.nextUrl.pathname.startsWith("/register")) {
            return NextResponse.redirect(new URL("/", request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/dashboard/:path*",
        "/login",
        "/register",
        "/forgot-password",
        "/profile/:path*",
    ],
};