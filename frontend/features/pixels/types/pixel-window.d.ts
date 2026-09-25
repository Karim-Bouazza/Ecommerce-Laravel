interface Window {
  fbq?: (...args: unknown[]) => void
  ttq?: {
    load: (pixelId: string) => void
    page: () => void
    track: (event: string, params?: Record<string, unknown>) => void
  }
  snaptr?: (...args: unknown[]) => void
  gtag?: (...args: unknown[]) => void
  dataLayer?: unknown[]
}
