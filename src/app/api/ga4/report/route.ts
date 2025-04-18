import { google } from "googleapis"
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth/options"

import path from "path"
import { readFileSync, stat } from "fs"

export async function POST(request: Request) {
    const session = await getServerSession(authOptions)

    if (!session?.accessToken) {
        return NextResponse.json({ error: "Unauthozired" }, { status: 401 })
    }

    const body = await request.json()
    const { propertyId } = body

    if (!propertyId) {
        return NextResponse.json({ error: "Missing propertyId" }, { status: 400 })
    }

    const auth = new google.auth.OAuth2()
    auth.setCredentials({ access_token: session.accessToken })

    const analyticsDataClient = google.analyticsdata({
        version: "v1beta",
        auth
    })

    try {
        const response = await analyticsDataClient.properties.runReport({
            property: `properties/${propertyId}`,
            requestBody: {
                dateRanges: [{ startDate: "yesterday", endDate: "today" }],
                metrics: [{ name: "activeUsers" }, { name: "sessions" }],
            }
        })

        return NextResponse.json(response.data)
    } catch (error) {
        console.error("GA4 API Error", error)
        return NextResponse.json({ error: "Failed to fetch GA4 data" }, { status: 500 })
    }
}

// *** OLD VERSION USING ga4-service-account:
/*
export async function POST(request: Request) {
    const body = await request.json()
    const { propertyId } = body 

    if (!propertyId) {
        return NextResponse.json({ error: "Missing propertyId" }, { status: 400 })
    }

    // *** Load service account key
    const keyPath = path.join(process.cwd(), "google", "ga4-service-account.json")
    const keyFile = JSON.parse(readFileSync(keyPath, "utf-8"))

    const auth = new google.auth.GoogleAuth({
        credentials: keyFile,
        scopes: ["https://www.googleapis.com/auth/analytics.readonly"],
    })

    const analyticsDataClient = google.analyticsdata({
        version: "v1beta",
        auth,
    })

    try {
        const response = await analyticsDataClient.properties.runReport({
            property: `properties/${propertyId}`,
            requestBody: {
                dateRanges: [{ startDate: "yesterday", endDate: "today" }],
                metrics: [{ name: "activeUsers" }, { name: "sessions" }],
            },
        })

        return NextResponse.json(response.data)
    } catch (error) {
        console.error("GA4 Api Error:", error)
        return NextResponse.json({ error: "Failed to fetch GA4 data" }, { status: 500 })
    }
}
*/