// POST (create), GET (read all for user)

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { connectDB } from "@/lib/db";
import { TrackedSite } from "@/lib/models/trackedSite";

export async function POST(req: Request) {
    const session = await getServerSession(authOptions)
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { url, ga4, ga4PropertyId } = await req.json()
    await connectDB()

    const site = await TrackedSite.create({
        userId: session.user?.email,
        url,
        ga4,
        ga4PropertyId,
    })

    return NextResponse.json(site)
}

export async function GET() {
    const session = await getServerSession(authOptions)
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()
    const sites = await TrackedSite.find({ userId: session.user?.email }).sort({ createdAt: -1 })

    return NextResponse.json(sites)
}