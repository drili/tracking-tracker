"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { normalizeUrl, isValidGA4Id } from "@/lib/utils"

interface TrackedSite {
    _id: string
    url: string
    ga4: string
    ga4PropertyId: string
    isGTMFound?: boolean
    lastCheckedAt?: string
    statusMessage?: string
    ga4Data?: any
}

export default function TrackedSitesPage() {
    const { data: session, status }: { data: any; status: "authenticated" | "unauthenticated" | "loading" } = useSession()

    const [url, setUrl] = useState("")
    const [sites, setSites] = useState<TrackedSite[]>([])
    const [ga4, setGa4] = useState("")
    const [ga4PropertyId, setGa4PropertyId] = useState("")
    const [error, setError] = useState("")

    const fetchSites = async () => {
        const res = await fetch("/api/sites")
        const data = await res.json()
        console.log({ data })
        setSites(data)
    }

    useEffect(() => {
        if (status === "authenticated") {
            fetchSites()
        }
    }, [status])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        const normalized = normalizeUrl(url)
        const ga4Valid = isValidGA4Id(ga4)

        if (!normalized) {
            setError("Please enter a valid URL")
            return
        }

        if (!ga4Valid) {
            setError("Please enter a valid GA4 Measurement ID (e.g. G-XXXXXX")
            return
        }

        const res = await fetch("/api/sites", {
            method: "POST",
            body: JSON.stringify({ url, ga4, ga4PropertyId })
        })

        if (res.ok) {
            setUrl("")
            setGa4("")
            setGa4PropertyId("")
            await fetchSites()
        }
    }

    const handleDelete = async (id: string) => {
        await fetch(`/api/sites/${id}`, {
            method: "DELETE"
        })
        await fetchSites()
    }

    const handleCheckGA4Data = async (siteId: string, ga4PropertyId: string) => {
        const data = await fetchGA4Data(ga4PropertyId)
        setSites((prevSites) =>
            prevSites.map((site) =>
                site._id === siteId ? { ...site, ga4Data: data } : site
            )
        )
    }

    const handleCheckGTMConnection = async (siteId: string) => {
        const res = await fetch(`/api/sites/${siteId}/check`, {
            method: "POST"
        })

        if (res.ok) {
            const updatedSite = await res.json()
            setSites((prev) =>
                prev.map((site) => (site._id === siteId ? updatedSite : site))
            )
        } else {
            console.error("::: Check failed")
        }
    }

    const fetchGA4Data = async (propertyId: string) => {
        const res = await fetch("/api/ga4/report", {
            method: "POST",
            body: JSON.stringify({ propertyId }),
        })
        
        const data = await res.json()
        console.log({data})
        return data
    }

    if (status === "loading") {
        return (
            <p>Loading...</p>
        )
    }
    if (status === "unauthenticated") {
        return (
            <p>You must be logged in</p>
        )
    }

    return (
        <section id="TrackedSitesPage">
            <div className="p-6 max-w-3xl mx-auto">
                <h1 className="text-2xl font-bold mb-4">Your Tracked Sites</h1>

                <div className="space-y-4">
                    <form onSubmit={handleSubmit} className="space-y-2 mb-10">
                        <Input
                            placeholder="https://your-site.com"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            required
                        />
                        <Input
                            placeholder="GA4 Property ID (e.g. 123456789)"
                            value={ga4PropertyId}
                            onChange={(e) => setGa4PropertyId(e.target.value)}
                            required
                        />
                        <Input
                            placeholder="GA4 Measurement ID (e.g. G-XXXXXX)"
                            value={ga4}
                            onChange={(e) => setGa4(e.target.value)}
                            required
                        />
                        <Button className="w-full" type="submit">
                            Add Site
                        </Button>
                    </form>

                    {error && <p className="text-red-500 text-sm">{error}</p>}

                    <div className="pt-6 space-y-2">
                        {sites.length === 0 ? (
                            <p className="text-sm text-muted-foreground">No added sites yet.</p>
                        ) : (
                            sites.map((site) => (
                                <Card key={site._id} className="p-4 flex flex-col justify-between">
                                    <span className="flex justify-between">
                                        <div>
                                            <p className="font-medium">{site.url}</p>
                                            <p className="text-sm text-muted-foreground">{site.ga4}</p>
                                            <p className="text-sm text-muted-foreground">{site.ga4PropertyId}</p>

                                            <div className="flex flex-col gap-0 mt-5">
                                                <span
                                                    className={`text-sm font-medium m-0 p-0 ${site.isGTMFound === true
                                                            ? "text-green-600"
                                                            : site.isGTMFound === false
                                                                ? "text-red-600"
                                                                : "text-gray-600"
                                                        }`}
                                                >
                                                    {site.isGTMFound === true
                                                        ? "✅ GTM code found"
                                                        : site.isGTMFound === false
                                                            ? "❌ GTM not found"
                                                            : "⏳ Not checked"
                                                    }
                                                </span>

                                                <span>
                                                    {site.lastCheckedAt && (
                                                        <span className="text-xs text-muted-foreground m-0 p-0">
                                                            Last checked: {new Date(site.lastCheckedAt).toLocaleString()}
                                                        </span>
                                                    )}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex gap-2">
                                            <Button variant="default" size="sm" onClick={() => handleCheckGTMConnection(site._id)}>Test GTM Connection</Button>
                                            <Button variant="default" size="sm" onClick={() => handleCheckGA4Data(site._id, site.ga4PropertyId)}>Test GA4 Data</Button>
                                            <Button variant="outline" size="sm">Edit</Button>
                                            <Button variant="destructive" size="sm" onClick={() => handleDelete(site._id)}>Delete</Button>
                                        </div>
                                    </span>
                                    
                                    <span>
                                        {site.ga4Data ? (
                                            <div>
                                                <p>Active Users: {site.ga4Data.rows?.[0]?.metricValues?.[0]?.value}</p>
                                                <p>Sessions: {site.ga4Data.rows?.[0]?.metricValues?.[1]?.value}</p>
                                            </div>
                                        ) : (
                                            <p className="text-xs text-muted-foreground">Run the GA4 connection to see latest data</p>
                                        )}
                                    </span>
                                </Card>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </section>
    )
}