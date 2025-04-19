"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"

type GA4Stream = {
    propertyId: string
    propertyName: string
    streamId: string
    streamName: string
    measurementId?: string
    defaultUri?: string
    createTime?: string
}

export default function GA4Properties() {
    const { data: session, status } = useSession()
    const [properties, setProperties] = useState<GA4Stream[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchProperties = async () => {
            try {
                const res = await fetch("/api/ga4/properties")
                const data = await res.json()

                if (res.ok) {
                    setProperties(data.properties || [])
                } else {
                    setError(data.error || "Failed to fetch GA4 properties")
                }
            } catch (err) {
                setError("An unexpected error occurred.")
                console.error(err)
            } finally {
                setLoading(false)
            }
        }

        if (status === "authenticated") {
            fetchProperties()
        }
    }, [status])

    return (
        <section id="GA4Properties" className="p-4">
            <h1 className="text-xl font-semibold mb-4">GA4 Properties & Streams</h1>

            {loading && <p>Loading...</p>}
            {error && <p className="text-red-500">{error}</p>}

            {!loading && !error && (
                <>
                    {properties.length === 0 ? (
                        <p className="text-gray-500">No GA4 properties found.</p>
                    ) : (
                        <ul className="space-y-4">
                            {properties.map((stream) => (
                                <li key={stream.streamId} className="border p-4 rounded shadow-sm">
                                    <div className="font-semibold text-lg">{stream.propertyName}</div>
                                    <div className="text-sm text-gray-500 mb-2">{stream.propertyId}</div>

                                    <div className="ml-4">
                                        <div><span className="font-medium">Stream:</span> {stream.streamName}</div>
                                        <div><span className="font-medium">Stream ID:</span> {stream.streamId}</div>
                                        <div><span className="font-medium">Measurement ID:</span> {stream.measurementId || "N/A"}</div>
                                        <div><span className="font-medium">Default URL:</span> {stream.defaultUri || "N/A"}</div>
                                        <div><span className="font-medium">Created:</span> {stream.createTime ? new Date(stream.createTime).toLocaleString() : "N/A"}</div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </>
            )}
        </section>
    )
}
