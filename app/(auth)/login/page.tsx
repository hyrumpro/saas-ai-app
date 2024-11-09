"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from 'lucide-react'
import { Icons } from "@/components/ui/icons";
import { cn } from "@/lib/utils";
import { loginWithEmail, loginWithGoogle, loginWithGithub } from "@/lib/auth";

interface AuthError {
    message: string;
    code?: number;
}

export default function LoginPage() {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [socialLoginType, setSocialLoginType] = useState<"google" | "github" | null>(null);

    async function onSubmit(event: React.FormEvent) {
        event.preventDefault();
        setIsLoading(true);
        setError(null);

        // Basic validation
        if (!email || !password) {
            setError("Please fill in all fields");
            setIsLoading(false);
            return;
        }

        try {
            const result = await loginWithEmail(email, password);
            if (!result.success) {
                setError((result.error as AuthError)?.message || "Invalid credentials");
            }
        } catch (err: any) {
            setError(err?.message || "An error occurred during login");
        } finally {
            setIsLoading(false);
        }
    }

    const handleSocialLogin = async (provider: "google" | "github") => {
        try {
            setIsLoading(true);
            setSocialLoginType(provider);
            setError(null);

            const loginFunction = provider === "google" ? loginWithGoogle : loginWithGithub;
            const result = await loginFunction();

            if (result.success && result.redirectUrl) {
                window.location.href = result.redirectUrl;
            } else {
                setError(`Failed to login with ${provider}`);
            }
        } catch (err: any) {
            setError(err?.message || `Failed to initialize ${provider} login`);
        } finally {
            setIsLoading(false);
            setSocialLoginType(null);
        }
    };

    return (
        <Card className="w-full max-w-md bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
            <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-bold text-center">Welcome back</CardTitle>
                <CardDescription className="text-center">
                    Choose your preferred login method
                </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
                {error && (
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}
                <form onSubmit={onSubmit} className="grid gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="name@example.com"
                            autoCapitalize="none"
                            autoComplete="email"
                            autoCorrect="off"
                            disabled={isLoading}
                            required
                            className={cn(
                                "transition-colors",
                                error && !email && "border-red-500 focus:border-red-500"
                            )}
                            aria-invalid={!!error}
                            aria-describedby={error ? "email-error" : undefined}
                        />
                    </div>
                    <div className="grid gap-2">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="password">Password</Label>
                            <Link
                                href="/forgot-password"
                                className="text-sm text-primary hover:text-primary/90 transition-colors"
                            >
                                Forgot?
                            </Link>
                        </div>
                        <Input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            autoCapitalize="none"
                            autoComplete="current-password"
                            autoCorrect="off"
                            disabled={isLoading}
                            required
                            className={cn(
                                "transition-colors",
                                error && !password && "border-red-500 focus:border-red-500"
                            )}
                            aria-invalid={!!error}
                            aria-describedby={error ? "password-error" : undefined}
                        />
                    </div>
                    <Button
                        type="submit"
                        disabled={isLoading}
                        className="w-full"
                    >
                        {isLoading ? (
                            <span className="flex items-center justify-center gap-2">
                                <Icons.spinner  />
                                Signing in...
                            </span>
                        ) : (
                            "Sign in"
                        )}
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

                <div className="grid gap-2">
                    {["google", "github"].map((provider) => (
                        <Button
                            key={provider}
                            variant="outline"
                            type="button"
                            disabled={isLoading}
                            onClick={() => handleSocialLogin(provider as "google" | "github")}
                            className="w-full"
                        >
                            {isLoading && socialLoginType === provider ? (
                                <Icons.spinner />
                            ) : (
                                <div className="flex items-center justify-center gap-2">
                                    {provider === "google" ? (
                                        <Icons.google />
                                    ) : (
                                        <Icons.gitHub />
                                    )}
                                    <span className="capitalize">{provider}</span>
                                </div>
                            )}
                        </Button>
                    ))}
                </div>
            </CardContent>
            <CardFooter>
                <p className="text-sm text-muted-foreground text-center w-full">
                    New here?{" "}
                    <Link
                        href="/register"
                        className="text-primary hover:text-primary/90 transition-colors font-medium"
                    >
                        Create an account
                    </Link>
                </p>
            </CardFooter>
        </Card>
    );
}