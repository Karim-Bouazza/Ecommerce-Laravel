type Entry<T> = { value: T; expiresAt: number }

/**
 * Tiny in-memory TTL cache for server components. Keeps one value per key in
 * the Node process; concurrent callers share the same in-flight promise. A
 * failed load is not cached, so the next request retries.
 */
export function ttlCache<T>(loader: () => Promise<T>, ttlMs: number): () => Promise<T> {
  let entry: Entry<T> | null = null
  let pending: Promise<T> | null = null

  return () => {
    if (entry && entry.expiresAt > Date.now()) {
      return Promise.resolve(entry.value)
    }

    if (!pending) {
      pending = loader()
        .then((value) => {
          entry = { value, expiresAt: Date.now() + ttlMs }
          return value
        })
        .finally(() => {
          pending = null
        })
    }

    return pending
  }
}
