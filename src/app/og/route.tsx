import { ImageResponse } from "next/og"
import { NextRequest } from "next/server"

export const runtime = "edge"

export async function GET(req: NextRequest) {
  const city  = req.nextUrl.searchParams.get("city") ?? "Mannheim"
  const vibe  = req.nextUrl.searchParams.get("vibe") ?? "Tonight"

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          background: "linear-gradient(135deg, #0a0a0f 0%, #1a0a2e 50%, #0a0a0f 100%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        {/* Glow */}
        <div style={{
          position: "absolute",
          top: "50%", left: "50%",
          transform: "translate(-50%, -60%)",
          width: "700px", height: "500px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(168,85,247,0.25) 0%, transparent 70%)",
        }} />

        {/* Content */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px", zIndex: 1 }}>
          <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "18px", letterSpacing: "0.4em", textTransform: "uppercase", margin: 0 }}>
            Your city · Tonight
          </p>
          <h1 style={{ color: "#e2e0ff", fontSize: "120px", fontWeight: 900, margin: 0, lineHeight: 1, letterSpacing: "-0.02em" }}>
            {city.toUpperCase()}
          </h1>
          <p style={{ color: "#a855f7", fontSize: "52px", fontWeight: 900, margin: 0, letterSpacing: "0.05em" }}>
            {vibe.toUpperCase()}
          </p>
        </div>

        {/* Bottom brand */}
        <div style={{
          position: "absolute", bottom: "40px",
          display: "flex", alignItems: "center", gap: "12px",
        }}>
          <div style={{
            width: "10px", height: "10px", borderRadius: "50%",
            background: "#22c55e",
          }} />
          <p style={{ color: "rgba(255,255,255,0.40)", fontSize: "20px", margin: 0, letterSpacing: "0.1em" }}>
            SZENE.APP
          </p>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  )
}
