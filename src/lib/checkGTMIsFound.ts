export async function checkGTMIsFound(url: string): Promise<{ ok: boolean, message: string }> {
    try {
        const res = await fetch(url, {
            headers: { "User-Agent": "Mozilla/5.0" }
        })

        const html = await res.text()
        const found = html.includes("GTM-")
        return {
            ok: found,
            message: found ? "GTM code found" : "GTM code not found"
        }
    } catch (error) {
        console.error("Error fetching page:", error)
        return {
            ok: false,
            message: "Unable to reach site or check code"
        }
    }
}