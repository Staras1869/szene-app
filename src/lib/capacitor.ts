/**
 * Capacitor native plugin bootstrap.
 * Call initMobile() once on app start (layout.tsx).
 * Safe to call on web — all checks are no-ops outside a native shell.
 */

export async function initMobile() {
  // Only run inside the Capacitor native shell
  const { Capacitor } = await import("@capacitor/core")
  if (!Capacitor.isNativePlatform()) return

  const platform = Capacitor.getPlatform() // "ios" | "android"

  // ── Status bar ────────────────────────────────────────────────────────────
  try {
    const { StatusBar, Style } = await import("@capacitor/status-bar")
    await StatusBar.setStyle({ style: Style.Light })
    await StatusBar.setBackgroundColor({ color: "#7c3aed" })
    if (platform === "android") {
      await StatusBar.setOverlaysWebView({ overlay: false })
    }
  } catch {}

  // ── Splash screen ─────────────────────────────────────────────────────────
  try {
    const { SplashScreen } = await import("@capacitor/splash-screen")
    await SplashScreen.hide({ fadeOutDuration: 300 })
  } catch {}

  // ── Safe-area CSS vars → Tailwind-friendly CSS variables ──────────────────
  // Capacitor exposes env(safe-area-inset-*) via WebKit; mirror them as
  // --safe-top / --safe-bottom so we can use them in Tailwind classes.
  const style = document.createElement("style")
  style.textContent = `
    :root {
      --safe-top:    env(safe-area-inset-top,    0px);
      --safe-bottom: env(safe-area-inset-bottom, 0px);
      --safe-left:   env(safe-area-inset-left,   0px);
      --safe-right:  env(safe-area-inset-right,  0px);
    }
  `
  document.head.appendChild(style)
}
