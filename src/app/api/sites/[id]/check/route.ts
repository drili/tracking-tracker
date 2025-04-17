import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth/options"
import { connectDB } from "@/lib/db"
import { TrackedSite } from "@/lib/models/trackedSite"
import { checkGTMIsFound } from "@/lib/checkGTMIsFound"

export async function POST(
    request: Request,
    context: { params: Promise<{ id: string }> }
) {
    const { id } = await context.params
    console.log({id})
    
    await connectDB()
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
        console.log("::: !session?.user?.email")
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const site = await TrackedSite.findById(id)

    if (!site) {
        console.log("::: !site")
        return NextResponse.json({ error: "Not found" }, { status: 401 })
    }

    try {
        const result = await checkGTMIsFound(site.url)
        console.log({result})

        site.isGTMFound = result.ok
        site.statusMessage = result.message
        site.lastCheckedAt = new Date()

        await site.save()

        console.log({site})
        return NextResponse.json(site)
    } catch (error) {
        console.error("GA4 check failed:", error)
        return NextResponse.json({ error: "Failed to check GA4" }, { status: 500 })
    }
}