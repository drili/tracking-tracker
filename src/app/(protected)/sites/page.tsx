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
}

export default function TrackedSitesPage() {
    const { data: session, status }: { data: any; status: "authenticated" | "unauthenticated" | "loading" } = useSession()

    const [url, setUrl] = useState("")
    const [sites, setSites] = useState<TrackedSite[]>([])
    const [ga4, setGa4] = useState("")
    const [error, setError] = useState("")

    const fetchSites = async () => {
        const res = await fetch("/api/sites")
        const data = await res.json()
        console.log({data})
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
            body: JSON.stringify({ url, ga4 })
        })

        if (res.ok) {
            setUrl("")
            setGa4("")
            await fetchSites()
        }
    }

    const handleDelete = async (id: string) => {
        await fetch(`/api/sites/${id}`, {
            method: "DELETE"
        })
        await fetchSites()
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
                                <Card key={site._id} className="p-4 flex flex-row justify-between items-center">
                                    <div>
                                        <p className="font-medium">{site.url}</p>
                                        <p className="text-sm text-muted-foreground">{site.ga4}</p>
                                    </div>

                                    <div className="flex gap-2">
                                        <Button variant="outline" size="sm">Edit</Button>
                                        <Button variant="destructive" size="sm" onClick={() => handleDelete(site._id)}>Delete</Button>
                                    </div>
                                </Card>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </section>
    )
}