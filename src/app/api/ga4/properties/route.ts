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

        const allPropertiesWithStreams = []

        for (const account of accounts) {
            const propertiesResponse = await analyticsAdmin.properties.list({
                filter: `parent:${account.name}`,
            })

            const properties = propertiesResponse.data.properties || []

            for (const property of properties) {
                const propertyName = property.name

                // Validate property name
                if (!propertyName || typeof propertyName !== "string" || !propertyName.startsWith("properties/")) {
                    continue
                }

                // Fetch data streams for this property
                const dataStreamsResponse = await analyticsAdmin.properties.dataStreams.list({
                    parent: propertyName,
                })

                const dataStreams = dataStreamsResponse.data.dataStreams || []

                const webStreams = dataStreams.filter(
                    (stream) => stream.type === "WEB_DATA_STREAM"
                )

                const enrichedStreams = webStreams.map((stream) => ({
                    propertyId: property.name,
                    propertyName: property.displayName,
                    streamId: stream.name,
                    streamName: stream.displayName,
                    measurementId: stream.webStreamData?.measurementId,
                    defaultUri: stream.webStreamData?.defaultUri,
                    createTime: stream.createTime,
                }))

                allPropertiesWithStreams.push(...enrichedStreams)
            }
        }

        return NextResponse.json({ properties: allPropertiesWithStreams })
    } catch (err) {
        console.error("Failed to fetch GA4 properties", err)
        return NextResponse.json({ error: "Failed to fetch GA4 properties" }, { status: 500 })
    }
}
