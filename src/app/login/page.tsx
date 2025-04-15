"use client"

import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"

export default function LoginPage() {
    return (
        <div className="h-screen flex items-center justify-center flex-col gap-4">
            <h1 className="text-2xl font-bold">Login</h1>
            <Button onClick={() => signIn("google")}>
                Sign in with Google
            </Button>

        </div>
    )
}