import React from "react";

export default function AuthLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <div className="auth">
            <div className="flex-center min-h-screen w-full max-w-5xl">
                <div className="flex w-full max-w-5xl flex-col lg:flex-row">
                    <div className="flex flex-1 items-center justify-center p-4 lg:p-8">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}