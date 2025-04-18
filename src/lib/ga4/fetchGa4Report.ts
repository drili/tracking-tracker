export async function fetchGa4Report(propertyId: string) {
    const response = await fetch("/api/ga4/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ propertyId }),
    })

    if (!response.ok) {
        const { error } = await response.json()
        throw new Error(error || "Unknown error")
    }

    return response.json()
}
