import { BetaAnalyticsDataClient } from "@google-analytics/data";
import path from "path";
import { readFileSync } from "fs";

const keyPath = path.join(process.cwd(), 'google', 'ga4-service-account.json')
const credentials = JSON.parse(readFileSync(keyPath, 'utf-8'))

// *** Initialize the GA4 Data API client
const analyticsDataClient = new BetaAnalyticsDataClient({
    credentials: {
        client_email: credentials.client_email,
        private_key: credentials.private_key,
    },
})

// *** Fetches the number of active users for the given propertyId over the past 7 days
export async function getActiveUsers(propertyId: string) {
    const [response] = await analyticsDataClient.runReport({
        property: `properties/${propertyId}`,
        dateRanges: [{ startDate: '7daysAgo', endDate: 'today' }],
        metrics: [{ name: 'activeUsers' }],
    })

    const activeUsers = response.rows?.[0]?.metricValues?.[0]?.value ?? null

    return {
        activeUsers,
    }
}