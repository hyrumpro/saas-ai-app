import React from "react";
import Sidebar from "@/components/shared/Sidebar"

export default function AuthLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <div className="root">
            <Sidebar />
            <div className="flex-center min-h-screen w-full max-w-5xl">
                    <div className="flex flex-1 items-center justify-center p-4 lg:p-8">
                        {children}
                    </div>
            </div>
        </div>
    );
}