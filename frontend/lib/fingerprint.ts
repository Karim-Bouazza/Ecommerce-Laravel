const STORAGE_KEY = "checkout-fp"
const TIMEOUT_MS = 2500

let pending: Promise<string | null> | null = null

function readSession(): string | null {
  try {
    return window.sessionStorage.getItem(STORAGE_KEY)
  } catch {
    return null
  }
}

function writeSession(value: string) {
  try {
    window.sessionStorage.setItem(STORAGE_KEY, value)
  } catch {
    // storage unavailable (private mode, blocked): the in-memory cache still applies
  }
}

async function collect(): Promise<string | null> {
  const FingerprintJS = await import("@fingerprintjs/fingerprintjs")
  const agent = await FingerprintJS.load({ monitoring: false })
  const result = await agent.get()
  return result.visitorId || null
}

/**
 * Browser fingerprint for fraud correlation only. It is a hint, never an
 * identity: it can change or be spoofed, and the server treats it that way.
 *
 * Client-only, computed at most once per browser session, and never throws:
 * any failure or timeout resolves to `null` so checkout is never blocked.
 */
export function getBrowserFingerprint(): Promise<string | null> {
  if (typeof window === "undefined") return Promise.resolve(null)
  if (pending) return pending

  const cached = readSession()
  if (cached) {
    pending = Promise.resolve(cached)
    return pending
  }

  const attempt = Promise.race([
    collect(),
    new Promise<null>((resolve) => setTimeout(() => resolve(null), TIMEOUT_MS)),
  ])
    .then((value) => {
      if (value) writeSession(value)
      else pending = null // allow a retry on the next submit
      return value
    })
    .catch(() => {
      pending = null
      return null
    })

  pending = attempt
  return attempt
}
