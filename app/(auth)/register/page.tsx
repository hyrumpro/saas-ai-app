"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Icons } from "@/components/ui/icons";
import { loginWithGoogle, registerUser } from "@/lib/auth";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface AuthError {
    message: string;
}

export default function RegisterPage() {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    async function onSubmit(event: React.SyntheticEvent) {
        event.preventDefault();
        setIsLoading(true);
        setError(null);

        if (!name || !email || !password) {
            setError("All fields are required");
            setIsLoading(false);
            return;
        }

        if (password.length < 8) {
            setError("Password must be at least 8 characters long");
            setIsLoading(false);
            return;
        }

        try {
            const result = await registerUser(email, password, name);

            if (result.success) {
                router.push("/login");
            } else {
                setError((result.error as AuthError)?.message || "Registration failed");
            }
        } catch (err) {
            setError((err as Error)?.message || "Registration failed");
        } finally {
            setIsLoading(false);
        }
    }

    const handleGoogleSignup = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const result = await loginWithGoogle();
            if (result.success) {
                router.push("/login");
            } else {
                setError((result.error as AuthError)?.message || "Google login failed");
            }
        } catch (err) {
            setError((err as Error)?.message || "Google login failed");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="w-full max-w-md">
            <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-bold text-center">Create an account</CardTitle>
                <CardDescription className="text-center">
                    Enter your details to create your account
                </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
                {error && (
                    <Alert variant="destructive">
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}
                <form onSubmit={onSubmit}>
                    <div className="grid gap-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="John Doe"
                            disabled={isLoading}
                            required
                            className={error && !name ? "border-red-500" : ""}
                        />
                    </div>
                    <div className="grid gap-2 mt-4">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="m@example.com"
                            disabled={isLoading}
                            required
                            className={error && !email ? "border-red-500" : ""}
                        />
                    </div>
                    <div className="grid gap-2 mt-4">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            disabled={isLoading}
                            required
                            className={error && !password ? "border-red-500" : ""}
                        />
                    </div>
                    <Button
                        className="w-full mt-6"
                        type="submit"
                        disabled={isLoading}
                    >
                        <span className="flex items-center justify-center">
                            {isLoading ? (
                                <div className="h-4 w-4 animate-spin">
                                    <Icons.spinner />
                                </div>
                            ) : (
                                "Create Account"
                            )}
                        </span>
                    </Button>
                </form>
                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-2 text-muted-foreground">
                            Or continue with
                        </span>
                    </div>
                </div>
                <Button
                    variant="outline"
                    type="button"
                    disabled={isLoading}
                    onClick={handleGoogleSignup}
                    className="w-full"
                >
                    <span className="flex items-center justify-center gap-2">
                        {isLoading ? (
                            <div className="h-4 w-4 animate-spin">
                                <Icons.spinner />
                            </div>
                        ) : (
                            <>
                                <div className="h-4 w-4">
                                    <Icons.google />
                                </div>
                                Google
                            </>
                        )}
                    </span>
                </Button>
            </CardContent>
            <CardFooter>
                <div className="text-sm text-muted-foreground text-center w-full">
                    Already have an account?{" "}
                    <Link
                        href="/login"
                        className="underline text-primary hover:text-primary/90 transition-colors"
                    >
                        Sign in
                    </Link>
                </div>
            </CardFooter>
        </Card>
    );
}