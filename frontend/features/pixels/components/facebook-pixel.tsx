"use client"

import * as React from "react"
import Script from "next/script"
import { usePathname } from "next/navigation"

import { useActivePixels } from "@/features/pixels/hooks/use-active-pixels"
import { markPixelsReady, setFacebookPixelIds } from "@/features/pixels/lib/track-events"

const EXCLUDED_PREFIXES = ["/admin", "/login"]

function toScriptLiteral(value: unknown) {
  return JSON.stringify(value).replace(/</g, "\\u003c")
}

function FacebookPixelInner() {
  const pathname = usePathname()
  const { data: pixels, isSuccess, isError } = useActivePixels()
  const pixelsResolved = isSuccess || isError

  const [isFbReady, setIsFbReady] = React.useState(false)
  const hasFiredInitialPageView = React.useRef(false)

  const isStorefront = !EXCLUDED_PREFIXES.some((prefix) => pathname?.startsWith(prefix))
  const facebookIds = React.useMemo(
    () => (pixels ?? []).filter((pixel) => pixel.provider === "facebook").map((pixel) => pixel.pixel_id),
    [pixels]
  )
  const hasFacebook = facebookIds.length > 0

  const markFbReady = React.useCallback(() => setIsFbReady(true), [])

  React.useEffect(() => {
    setFacebookPixelIds(facebookIds)
  }, [facebookIds])

  React.useEffect(() => {
    if (hasFiredInitialPageView.current || !pixelsResolved || !isStorefront) return
    if (hasFacebook && !isFbReady) return

    if (hasFacebook) window.fbq?.("track", "PageView")
    hasFiredInitialPageView.current = true
    markPixelsReady()
  }, [pixelsResolved, isStorefront, hasFacebook, isFbReady])

  React.useEffect(() => {
    if (!hasFiredInitialPageView.current || !isStorefront || !isFbReady) return

    window.fbq?.("track", "PageView")
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  if (!isStorefront || !hasFacebook) return null

  return (
    <Script id="fb-pixel-base" strategy="afterInteractive" onReady={markFbReady}>
      {`
        !function(f,b,e,v,n,t,s)
        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s)}(window, document,'script',
        'https://connect.facebook.net/en_US/fbevents.js');
        ${toScriptLiteral(facebookIds)}.forEach(function(id){ window.fbq('init', id); });
      `}
    </Script>
  )
}

export function FacebookPixel() {
  return (
    <React.Suspense fallback={null}>
      <FacebookPixelInner />
    </React.Suspense>
  )
}
