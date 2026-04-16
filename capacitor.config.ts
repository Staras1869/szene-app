import type { CapacitorConfig } from "@capacitor/cli"

// For dev: set CAP_SERVER_URL=http://192.168.x.x:3000 to live-reload from
// your local Next.js dev server. Unset for production (loads bundled build).
const DEV_URL = process.env.CAP_SERVER_URL

const config: CapacitorConfig = {
  appId: "de.szene.app",
  appName: "Szene",
  webDir: "out",            // used only when no server.url is set

  server: {
    // Production: loads the deployed Vercel site so API routes work.
    // Swap to undefined + use webDir for a fully offline build.
    url: DEV_URL ?? "https://szene-app.vercel.app",
    androidScheme: "https",
    cleartext: false,
    allowNavigation: ["szene-app.vercel.app"],
  },

  plugins: {
    SplashScreen: {
      launchShowDuration: 1800,
      launchAutoHide: true,
      backgroundColor: "#7c3aed",
      androidSplashResourceName: "splash",
      androidScaleType: "CENTER_CROP",
      showSpinner: false,
      splashFullScreen: true,
      splashImmersive: true,
    },

    StatusBar: {
      style: "LIGHT",
      backgroundColor: "#7c3aed",
    },

    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"],
    },
  },
}

export default config
