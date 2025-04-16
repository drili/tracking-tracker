"use client"

import { signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
    const { data: session } = useSession()

    if (!session) {
        return (
            <div className="p-4">
                <h1>You must be logged in to view this page.</h1>
            </div>
        )
    }

    return (
        <div className="p-4">
            <h1 className="text-3xl font-bold">Welcome to your dashboard, {session.user?.name}</h1>
            <p className="mt-2">You are logged in with {session.user?.email}</p>

            <section>
                <Button onClick={() => signOut()}>
                    Sign out
                </Button>
            </section>
            
        </div>
    )
}