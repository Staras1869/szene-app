function isLocalImage(url: string): boolean {
    return url.startsWith("/") || url.startsWith("data:") || url.startsWith("blob:")
}

export function getCachedImageUrl(url: string | null | undefined): string | null {
    if (!url) return null
    if (isLocalImage(url)) return url
    try {
        const parsed = new URL(url)
        if (!["http:", "https:"].includes(parsed.protocol)) return null
        return `/api/image/proxy?url=${encodeURIComponent(url)}`
    } catch {
        return null
    }
}

export function getBestImage(event: any, venue?: any): string {
    const image = event?.imageUrl || event?.image || event?.cover || event?.logoUrl || venue?.imageUrl
    return getCachedImageUrl(image) ?? "/placeholder.svg?height=400&width=600&query=event"
}

export default getBestImage
