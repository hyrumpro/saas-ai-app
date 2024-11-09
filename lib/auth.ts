"use server";

import { ID, Models, OAuthProvider} from "appwrite";
import {createAdminClient, createSessionClient} from "./appwrite/server";
import { cookies } from "next/headers";


interface AuthResponse {
    success: boolean;
    session?: Models.Session;
    error?: unknown;
    user?: Models.User<Models.Preferences>;
}

interface OAuthResponse {
    success: boolean;
    error?: unknown;
    redirectUrl?: string;
}

interface LogoutResponse {
    success: boolean;
    error?: unknown;
}




export async function registerUser(
    email: string,
    password: string,
    name: string
): Promise<AuthResponse> {
     const { account } = await createAdminClient();
    try {
        const user = await account.create(
            ID.unique(),
            email,
            password,
            name
        );

        const session = await account.createEmailPasswordSession(
            email,
            password
        );
        // @ts-expect-error - Next.js 15 types issue
        await cookies().set("session_secret", session.secret, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            expires: new Date(session.expire), // 7 days
            path: "/"
        });

        return { success: true, session, user };
    } catch (error) {
        console.error("Registration error:", error);
        return { success: false, error };
    }
}


export async function loginWithEmail(
    email: string,
    password: string
): Promise<AuthResponse> {
    const { account } = await createAdminClient();
    try {
        const session = await account.createEmailPasswordSession(
            email,
            password
        );
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

        const user = await account.get();
        await account.get()
        return { success: true, session, user };
    } catch (error) {
        console.error("Login error:", error);
        return { success: false, error };
    }
}

// Google OAuth login
export async function loginWithGoogle(): Promise<OAuthResponse> {
    try {
        const { account } = await createAdminClient();

        const token = await account.createOAuth2Token(
            OAuthProvider.Google,
            `${process.env.NEXT_PUBLIC_APP_URL}/oauth`,
            `${process.env.NEXT_PUBLIC_APP_URL}/login`,
            ['email', 'profile']
        );

        // Return the URL string directly
        return {
            success: true,
            redirectUrl: token.toString()
        };
    } catch (error) {
        console.error("Google auth error:", error);
        return { success: false, error };
    }
}


export async function loginWithGithub(): Promise<OAuthResponse> {
    try {
        const { account } = await createAdminClient();

        const token = await account.createOAuth2Token(
            OAuthProvider.Github,
            `${process.env.NEXT_PUBLIC_APP_URL}/oauth`,
            `${process.env.NEXT_PUBLIC_APP_URL}/login`,
            ['user:email']
        );

        return {
            success: true,
            redirectUrl: token.toString()
        };
    } catch (error) {
        console.error("GitHub auth error:", error);
        return { success: false, error };
    }
}



export async function createPasswordRecovery(email: string, url: string) {
    try {
        const { account } = await createAdminClient();
        await account.createRecovery(email, url);
        return { success: true };
    } catch (error: any) {
        console.error('Password recovery error:', error);
        return {
            success: false,
            error: error?.message || 'Failed to send recovery email'
        };
    }
}

export async function logout(): Promise<LogoutResponse> {
    try {
        const { account } = await createSessionClient();

        const cookieStore = await cookies();

        const cookieSessionId = cookieStore.get("auth_session")?.value;

        if (cookieSessionId) {
            await account.deleteSession(cookieSessionId);
        }

        cookieStore.delete("auth_session");
        cookieStore.delete("session_secret");

        return { success: true };
    } catch (error) {
        console.error("Logout error:", error);
        return { success: false, error };
    }
}

// Get current auth status
export async function getAuthStatus(): Promise<{
    authenticated: boolean;
    user: Models.User<Models.Preferences> | null;
}> {
    try {
        const { account } = await createAdminClient();
        const user = await account.get();
        return { authenticated: true, user };
    } catch (error) {
        console.error("Auth status error:", error);
        return { authenticated: false, user: null };
    }
}

// Get current session
export async function getCurrentSession(): Promise<Models.Session | null> {
    try {
        const { account } = await createAdminClient();
        return await account.getSession('current');
    } catch (error) {
        console.error("Get session error:", error);
        return null;
    }
}