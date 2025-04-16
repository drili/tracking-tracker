"use client"

import { AuthProvider } from "@/components/providers/SessionProvider"

export default function ProtectedLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <AuthProvider>{children}</AuthProvider>
}