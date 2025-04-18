"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"

export default function GA4Properties() {
    const { data: session, status }: { data: any; status: "authenticated" | "unauthenticated" | "loading" } = useSession()
    const [properties, setProperties] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        console.log("GA4Properties")
        const fetchProperties = async () => {
            console.log("fetchProperties")
            try {
                const res = await fetch("/api/ga4/properties")
                const data = await res.json()

                console.log({data})
                if (res.ok) {
                    console.log({data})
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
            <h1 className="text-xl font-semibold mb-4">GA4 Properties</h1>

            {loading && <p>Loading...</p>}
            {error && <p className="text-red-500">{error}</p>}

            {!loading && !error && (
                <ul className="space-y-2">
                    {properties.map((prop) => (
                        <li key={prop.name} className="border p-3 rounded">
                            <div className="font-medium">{prop.displayName}</div>
                            <div className="text-sm text-gray-500">{prop.name}</div>
                        </li>
                    ))}
                    {properties.length === 0 && (
                        <p className="text-gray-500">No GA4 properties found.</p>
                    )}
                </ul>
            )}
        </section>
    )
}