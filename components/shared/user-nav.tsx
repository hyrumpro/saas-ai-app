"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import useUser from "@/lib/hooks/useUser";
import Link from "next/link";
import { LogOut, User, Loader2 } from "lucide-react";
import { logout } from "@/lib/auth";

export function UserNav() {
    const { data: user, isLoading } = useUser();
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const queryClient = useQueryClient();
    const router = useRouter();

    const handleLogout = async () => {
        try {
            setIsLoggingOut(true);

            const result = await logout();

            if (result.success) {

                queryClient.setQueryData(['user'], null);

                await queryClient.invalidateQueries({ queryKey: ['user'] });
                queryClient.removeQueries({ queryKey: ['user'] });

                router.refresh();
                router.push('/login');


            } else {
                throw new Error('Logout failed');
            }
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            setIsLoggingOut(false);
        }
    };

    if (isLoading) {
        return (
            <Button variant="ghost" size="sm" className="w-9 px-0">
                <Avatar className="h-7 w-7">
                    <AvatarFallback>
                        <Loader2 className="h-4 w-4 animate-spin" />
                    </AvatarFallback>
                </Avatar>
            </Button>
        );
    }

    if (!user?.$id) {
        return (
            <Button asChild variant="secondary" size="sm">
                <Link href="/login">
                    Log in
                </Link>
            </Button>
        );
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="sm"
                    className="relative h-8 w-8 rounded-full"
                    disabled={isLoggingOut}
                >
                    <Avatar className="h-8 w-8">
                        <AvatarFallback>
                            {user.email?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user.email}</p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                    <Link
                        href="/settings"
                        className="flex w-full cursor-pointer items-center"
                    >
                        <User className="mr-2 h-4 w-4" />
                        Profile
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    className="text-red-600 cursor-pointer"
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                >
                    {isLoggingOut ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Logging out...
                        </>
                    ) : (
                        <>
                            <LogOut className="mr-2 h-4 w-4" />
                            Log out
                        </>
                    )}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}