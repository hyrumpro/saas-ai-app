'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { AlertCircle, ArrowRight, CheckCircle2, ArrowLeft } from "lucide-react";
import { createPasswordRecovery } from '@/lib/auth';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        try {
            const result = await createPasswordRecovery(
                email,
                `${window.location.origin}/reset-password`
            );

            if (result.success) {
                setIsSubmitted(true);
            } else {
                setError(result.error || 'Failed to send reset link. Please try again.');
            }
        } catch (err: any) {
            console.error('Password recovery error:', err);
            setError(err?.message || 'An unexpected error occurred. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleBackClick = () => {
        if (isSubmitting) return;
        router.back();
    };

    return (
        <div className="auth">
            <Card className="w-full max-w-md bg-white/95 backdrop-blur-sm">
                <CardHeader className="space-y-1">
                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="rounded-full hover:bg-purple-100"
                            onClick={handleBackClick}
                            disabled={isSubmitting}
                        >
                            <ArrowLeft className="h-4 w-4 text-purple-500" />
                        </Button>
                        <CardTitle className="text-2xl font-bold gradient-text">
                            Reset Password
                        </CardTitle>
                    </div>
                    <CardDescription className="text-dark-400">
                        Enter your email address and we will send you a link to reset your password.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {!isSubmitted ? (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-dark-400">
                                    Email
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="bg-purple-100/20 border-purple-200 focus:border-purple-500 focus:ring-purple-500"
                                    required
                                    disabled={isSubmitting}
                                    aria-invalid={!!error}
                                    aria-describedby={error ? "email-error" : undefined}
                                />
                            </div>
                            {error && (
                                <div
                                    id="email-error"
                                    className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg"
                                    role="alert"
                                >
                                    <AlertCircle size={20} />
                                    <span className="text-sm">{error}</span>
                                </div>
                            )}
                            <Button
                                type="submit"
                                className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <span className="flex items-center justify-center">
                                        Sending...
                                        <ArrowRight className="ml-2 h-4 w-4 animate-pulse" />
                                    </span>
                                ) : (
                                    <span>Send Reset Link</span>
                                )}
                            </Button>
                        </form>
                    ) : (
                        <div className="text-center space-y-4 py-6">
                            <div className="flex items-center justify-center text-purple-600">
                                <CheckCircle2 size={48} />
                            </div>
                            <p className="text-lg font-semibold text-dark-600">
                                Reset link sent!
                            </p>
                            <p className="text-sm text-dark-400">
                                Please check your email for instructions to reset your password.
                            </p>
                            <Button
                                onClick={() => router.push('/login')}
                                className="mt-4 bg-purple-100 text-purple-600 hover:bg-purple-200"
                            >
                                Return to Login
                            </Button>
                        </div>
                    )}
                </CardContent>
                <CardFooter className="flex justify-center">
                    <p className="text-sm text-dark-400">
                        Remember your password?{" "}
                        <Link
                            href="/login"
                            className="text-purple-600 hover:text-purple-700 font-semibold"
                        >
                            Sign in
                        </Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
}