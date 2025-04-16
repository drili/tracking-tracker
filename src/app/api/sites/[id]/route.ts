// PUT (update), DELETE

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { connectDB } from "@/lib/db";
import { TrackedSite } from "@/lib/models/trackedSite";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions)
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { url, ga4 } = await req.json()
    await connectDB()

    const updated = await TrackedSite.findOneAndUpdate(
        { _id: params.id, userId: session.user?.email },
        { url, ga4 },
        { new: true }
    )

    return NextResponse.json(updated)
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions)
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()
    await TrackedSite.findOneAndDelete({ _id: params.id, userId: session.user?.email })

    return NextResponse.json({ success: true })
}