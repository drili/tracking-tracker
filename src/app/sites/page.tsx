"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

export default function TrackedSitesPage() {
    const { data: session } = useSession()
    const [url, setUrl] = useState("")
    const [measurementId, setMeasurementId] = useState("")
    const [sites, setSites] = useState([
        // *** TODO: Mocked data, update with real data
        { id: 1, url: "https://example.com", ga4: "G-XXXXX1" },
        { id: 2, url: "https://example-2.com", ga4: "G-XXXXX2" },
    ])

    const handleAddSite = async () => {
        if (!url || !measurementId) {
            return
        }

        // *** TEMP
        const newSite = {
            id: Math.random(),
            url,
            ga4: measurementId
        }

        setSites((prev) => [...prev, newSite])
        setUrl("")
        setMeasurementId("")
    }

    if (!session) {
        return null
    }

    return (
        <section id="TrackedSitesPage">
            <div className="p-6 max-w-3xl mx-auto">
                <h1 className="text-2xl font-bold mb-4">Your Tracked Sites</h1>

                <div className="space-y-4">
                    <div className="space-y-2">
                        <Input
                            placeholder="https://your-site.com"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                        />
                        <Input
                            placeholder="GA4 Measurement ID (e.g. G-XXXXXX)"
                            value={measurementId}
                            onChange={(e) => setMeasurementId(e.target.value)}
                        />
                        <Button className="w-full" onClick={handleAddSite}>
                            Add Site
                        </Button>
                    </div>

                    <div className="pt-6 space-y-2">
                        {sites.length === 0 ? (
                            <p className="text-sm text-muted-foreground">No added sites yet.</p>
                        ) : (
                            sites.map((site) => (
                                <Card key={site.id} className="p-4 flex flex-row justify-between items-center">
                                    <div>
                                        <p className="font-medium">{site.url}</p>
                                        <p className="text-sm text-muted-foreground">{site.ga4}</p>
                                    </div>

                                    <div className="flex gap-2">
                                        <Button variant="outline" size="sm">Edit</Button>
                                        <Button variant="destructive" size="sm">Delete</Button>
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