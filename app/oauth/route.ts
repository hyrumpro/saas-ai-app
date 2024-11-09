import { createAdminClient } from "@/lib/appwrite/server";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try {
        const userId = request.nextUrl.searchParams.get("userId");
        const secret = request.nextUrl.searchParams.get("secret");

        if (!userId || !secret) {
            return NextResponse.redirect(
                `${process.env.NEXT_PUBLIC_APP_URL}/login?error=invalid_callback`
            );
        }

        const { account } = await createAdminClient();

        try {
            // Create a new session with the provided credentials
            const session = await account.createSession(userId, secret);

            const cookieStore = await cookies();

            cookieStore.set("session_secret", session.secret, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                expires: new Date(session.expire),
                path: "/"
            });

            cookieStore.set("auth_session", session.$id, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                expires: new Date(session.expire),
                path: "/"
            });

            return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/`);
        } catch (sessionError) {
            console.error("Session creation error:", sessionError);
            return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/`);
        }
    } catch (error) {
        console.error("OAuth callback error:", error);
        return NextResponse.redirect(
            `${process.env.NEXT_PUBLIC_APP_URL}/login?error=auth_failed`
        );
    }
}