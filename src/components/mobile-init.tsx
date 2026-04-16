"use client"

import { useEffect } from "react"

export function MobileInit() {
  useEffect(() => {
    import("@/lib/capacitor").then(({ initMobile }) => initMobile())
  }, [])

  return null
}
