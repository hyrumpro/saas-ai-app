"use server";

import { Client, Account, Databases, Models } from "node-appwrite";
import { cookies } from "next/headers";

// Types
type AppwriteClient = {
    account: Account;
    databases: Databases;
};

export async function createAdminClient(): Promise<AppwriteClient> {
    const client = new Client();

    client
        .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
        .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!)
        .setKey(process.env.NEXT_APPWRITE_API_KEY!);

    return {
        account: new Account(client),
        databases: new Databases(client),
    };
}


export async function fetchUserData() {
    try {
        const { account } = await createSessionClient();

        const cookieStore = await cookies();

        const sessionSecret = cookieStore.get("session_secret")?.value;

        if (!sessionSecret) {
            return null;
        }

        const user = await account.get();
        return user;
    } catch (error) {
        console.error('Error fetching user:', error);
        return null;
    }
}


export async function createSessionClient() {
    const client = new Client();
    client
        .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
        .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!);

    const cookieStore = await cookies();

    const session = cookieStore.get("session_secret");

    if (session) {
       client.setSession(session.value)
    }

    return {
        get account() {
            return new Account(client);
        },
        get database() {
            return new Databases(client)
        }
    };
}