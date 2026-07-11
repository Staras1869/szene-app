import fs from "fs/promises"
import path from "path"
import crypto from "crypto"

const CACHE_DIR = path.join(process.cwd(), ".cache", "images")

function hashUrl(url: string): string {
    return crypto.createHash("sha256").update(url).digest("hex")
}

function extensionForUrl(url: string): string {
    try {
        const pathname = new URL(url).pathname
        const ext = path.extname(pathname)
        if (ext && ext.length <= 5) return ext
    } catch {
        // ignore
    }
    return ".bin"
}

async function ensureCacheDir(): Promise<void> {
    await fs.mkdir(CACHE_DIR, { recursive: true })
}

async function fileExists(filePath: string): Promise<boolean> {
    try {
        await fs.access(filePath)
        return true
    } catch {
        return false
    }
}

async function readMetadata(metaPath: string): Promise<{ contentType?: string } | null> {
    try {
        const raw = await fs.readFile(metaPath, "utf8")
        return JSON.parse(raw)
    } catch {
        return null
    }
}

export async function getCachedImagePath(url: string): Promise<string> {
    const hash = hashUrl(url)
    const ext = extensionForUrl(url)
    return path.join(CACHE_DIR, `${hash}${ext}`)
}

export async function getCachedImageMetadataPath(url: string): Promise<string> {
    const hash = hashUrl(url)
    return path.join(CACHE_DIR, `${hash}.json`)
}

export async function fetchAndCacheImage(url: string): Promise<{ buffer: Buffer; contentType: string }> {
    await ensureCacheDir()

    const imagePath = await getCachedImagePath(url)
    const metaPath = await getCachedImageMetadataPath(url)

    if (await fileExists(imagePath)) {
        const buffer = await fs.readFile(imagePath)
        const metadata = await readMetadata(metaPath)
        return {
            buffer,
            contentType: metadata?.contentType ?? "application/octet-stream",
        }
    }

    const response = await fetch(url, {
        headers: {
            "User-Agent": "Mozilla/5.0 (compatible; SzeneApp/1.0; +https://szene.app)",
            Accept: "image/*,*/*;q=0.8",
        },
    })

    if (!response.ok) {
        throw new Error(`Failed to fetch image ${url}: ${response.status} ${response.statusText}`)
    }

    const arrayBuffer = await response.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    const contentType = response.headers.get("content-type")?.split(";")[0] ?? "application/octet-stream"

    await fs.writeFile(imagePath, buffer)
    await fs.writeFile(metaPath, JSON.stringify({ url, contentType, cachedAt: new Date().toISOString() }, null, 2), "utf8")

    return { buffer, contentType }
}

export async function getCachedImageBuffer(url: string): Promise<{ buffer: Buffer; contentType: string }> {
    try {
        return await fetchAndCacheImage(url)
    } catch (error) {
        throw error
    }
}
