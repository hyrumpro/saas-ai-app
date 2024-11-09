// lib/hooks/useUser.ts
"use client";

import { useQuery } from "@tanstack/react-query";
import { Models } from "appwrite";
import { fetchUserData } from "@/lib/appwrite/server";

interface ProfileDocument {
    $id: string;
    $collectionId: string;
    $databaseId: string;
    $createdAt: string;
    $updatedAt: string;
    $permissions: string[];
    user_id: string;
    created_at: string;
    display_name: string;
    image_url: string;
    subscription?: {
        created_at: string;
        customer_id: string;
        subscription_id: string;
        end_at: string;
    } | null;
}

export type UserProfile = Omit<ProfileDocument, "$collectionId" | "$databaseId" | "$createdAt" | "$updatedAt" | "$permissions" | "user_id">;

export type ExtendedUser = Models.User<Models.Preferences> & {
    profile: UserProfile;
};

const initUser = {
    $id: "",
    name: "",
    email: "",
    emailVerification: false,
    preferences: {},
    profile: {
        $id: "",
        created_at: "",
        display_name: "",
        image_url: "",
        subscription: null
    }
};

export default function useUser() {
    return useQuery({
        queryKey: ['user'],
        queryFn: async () => {
            try {
                const user = await fetchUserData();
                console.log(user);
                if (!user) return initUser;
                console.log(user);
                return user;
            } catch (error) {
                console.error('Error in useUser:', error);
                return initUser;
            }
        },
        staleTime: 1000 * 60 * 5, // 5 minutes
        refetchOnWindowFocus: true,
        refetchOnMount: true
    });
}


export function useUserIsLoading() {
    const { isLoading } = useUser();
    return isLoading;
}

export function useIsAuthenticated() {
    const { data } = useUser();
    return data?.$id !== "";
}


