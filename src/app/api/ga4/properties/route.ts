import { google } from "googleapis"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth/options"
import { NextResponse } from "next/server"

export async function GET() {
    const session = await getServerSession(authOptions)
    const accessToken = session?.accessToken as string

    if (!accessToken) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const auth = new google.auth.OAuth2()
    auth.setCredentials({ access_token: accessToken })

    const analyticsAdmin = google.analyticsadmin({ version: "v1beta", auth })

    try {
        const accountsResponse = await analyticsAdmin.accounts.list()
        const accounts = accountsResponse.data.accounts || []

        const allProperties = []

        for (const account of accounts) {
            const accountId = account.name
            const propertiesResponse = await analyticsAdmin.properties.list({
                filter: `parent:${account.name}`,
            })
            const properties = propertiesResponse.data.properties || []
            allProperties.push(...properties)
        }

        return NextResponse.json({ properties: allProperties })
    } catch (err) {
        console.error("Failed to fetch GA4 properties", err)
        return NextResponse.json({ error: "Failed to fetch GA4 properties" }, { status: 500 })
    }
}
