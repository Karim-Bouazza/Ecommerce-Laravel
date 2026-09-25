"use client"

import * as React from "react"
import Script from "next/script"
import { usePathname, useSearchParams } from "next/navigation"

import { useActivePixels } from "@/features/pixels/hooks/use-active-pixels"
import { markPixelsReady } from "@/features/pixels/lib/track-events"
import type { ActivePixel, PixelProvider } from "@/features/pixels/types"

const EXCLUDED_PREFIXES = ["/admin", "/login"]
const BASE_SCRIPT_PROVIDERS = ["facebook", "tiktok", "snapchat"] as const

function groupByProvider(pixels: ActivePixel[]) {
  return {
    facebook: pixels.filter((pixel) => pixel.provider === "facebook").map((pixel) => pixel.pixel_id),
    tiktok: pixels.filter((pixel) => pixel.provider === "tiktok").map((pixel) => pixel.pixel_id),
    snapchat: pixels.filter((pixel) => pixel.provider === "snapchat").map((pixel) => pixel.pixel_id),
    google: pixels.filter((pixel) => pixel.provider === "google").map((pixel) => pixel.pixel_id),
  }
}

// Serialize pixel IDs for safe interpolation into inline <script> contents.
function toScriptLiteral(value: unknown) {
  return JSON.stringify(value).replace(/</g, "\\u003c")
}

function fireBasePageView(readyProviders: Set<PixelProvider>) {
  if (readyProviders.has("facebook")) window.fbq?.("track", "PageView")
  if (readyProviders.has("tiktok")) window.ttq?.page()
  if (readyProviders.has("snapchat")) window.snaptr?.("track", "PAGE_VIEW")
}

function fireGooglePageView(googleIds: string[]) {
  googleIds.forEach((id) => window.gtag?.("event", "page_view", { send_to: id }))
}

function TrackingPixelsInner() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { data: pixels, isSuccess, isError } = useActivePixels()
  const pixelsResolved = isSuccess || isError

  const [readyProviders, setReadyProviders] = React.useState<Set<PixelProvider>>(new Set())
  const hasFiredInitialPageView = React.useRef(false)

  const isStorefront = !EXCLUDED_PREFIXES.some((prefix) => pathname?.startsWith(prefix))
  const grouped = React.useMemo(() => groupByProvider(pixels ?? []), [pixels])
  const hasPixels = (pixels?.length ?? 0) > 0

  const expectedProviders = React.useMemo(
    () => new Set(BASE_SCRIPT_PROVIDERS.filter((provider) => grouped[provider].length > 0)),
    [grouped]
  )

  // next/script calls onReady for inline scripts *before* the script element is executed,
  // so pixel init must live inside the inline script itself; onReady only flags the provider.
  // The resulting state update re-renders after the script has run, so PageView fires on an initialized pixel.
  const markReady = React.useCallback(
    (provider: PixelProvider) => () => {
      setReadyProviders((prev) => new Set(prev).add(provider))
    },
    []
  )

  // Fire the initial PageView once every base script that has an active pixel has finished loading.
  // Google is excluded here: gtag('config', id) already sends its own page_view on init.
  // Waits for the active-pixels query first, otherwise the empty initial state would count as "all ready".
  // Events tracked before this point (e.g. ViewContent on a landing page) are queued and flushed after PageView.
  React.useEffect(() => {
    if (hasFiredInitialPageView.current || !pixelsResolved || !isStorefront) return
    if (readyProviders.size < expectedProviders.size) return

    fireBasePageView(readyProviders)
    hasFiredInitialPageView.current = true
    markPixelsReady()
  }, [pixelsResolved, isStorefront, readyProviders, expectedProviders])

  // Fire PageView again on every client-side route change (SPA navigations don't reload the base scripts).
  React.useEffect(() => {
    if (!hasFiredInitialPageView.current || !isStorefront) return

    fireBasePageView(readyProviders)
    fireGooglePageView(grouped.google)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, searchParams])

  if (!isStorefront || !hasPixels) return null

  return (
    <>
      {grouped.facebook.length > 0 && (
        <Script
          id="fb-pixel-base"
          strategy="afterInteractive"
          onReady={markReady("facebook")}
        >
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            ${toScriptLiteral(grouped.facebook)}.forEach(function(id){ window.fbq('init', id); });
          `}
        </Script>
      )}

      {grouped.tiktok.length > 0 && (
        <Script
          id="tiktok-pixel-base"
          strategy="afterInteractive"
          onReady={markReady("tiktok")}
        >
          {`
            !function (w, d, t) {
              w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie","holdConsent","revokeConsent","grantConsent"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<e.length;n++)ttq.setAndDefer(e,e[n]);return e},ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js",o=n&&n.partner;ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=i,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};var p=d.createElement("script");p.type="text/javascript",p.async=!0,p.src=i+"?sdkid="+e+"&lib="+t;var w2=d.getElementsByTagName("script")[0];w2.parentNode.insertBefore(p,w2)};
            }(window, document, 'ttq');
            ${toScriptLiteral(grouped.tiktok)}.forEach(function(id){ window.ttq.load(id); });
          `}
        </Script>
      )}

      {grouped.snapchat.length > 0 && (
        <Script
          id="snap-pixel-base"
          strategy="afterInteractive"
          onReady={markReady("snapchat")}
        >
          {`
            (function(e,t,n){if(e.snaptr)return;var a=e.snaptr=function()
            {a.handleRequest?a.handleRequest.apply(a,arguments):a.queue.push(arguments)};
            a.queue=[];var s='script';var r=t.createElement(s);r.async=!0;
            r.src=n;var u=t.getElementsByTagName(s)[0];
            u.parentNode.insertBefore(r,u);})(window,document,
            'https://sc-static.net/scevent.min.js');
            ${toScriptLiteral(grouped.snapchat)}.forEach(function(id){ window.snaptr('init', id); });
          `}
        </Script>
      )}

      {grouped.google.map((id) => (
        <React.Fragment key={id}>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${id}`} strategy="afterInteractive" />
          <Script id={`ga-init-${id}`} strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              window.gtag = window.gtag || function(){window.dataLayer.push(arguments);};
              window.gtag('js', new Date());
              window.gtag('config', '${id}');
            `}
          </Script>
        </React.Fragment>
      ))}
    </>
  )
}

export function TrackingPixels() {
  return (
    <React.Suspense fallback={null}>
      <TrackingPixelsInner />
    </React.Suspense>
  )
}
