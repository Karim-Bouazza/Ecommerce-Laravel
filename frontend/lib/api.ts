import axios, { AxiosError } from "axios"

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000"

// Server-side rendering talks to the backend over the private Docker network
// (e.g. http://backend:8000) instead of going out through the public domain,
// TLS and the edge nginx — which is slower and would put every visitor's SSR
// request under one shared per-IP rate limit. The browser always uses the
// public URL. INTERNAL_API_URL is read at runtime, so no rebuild is needed.
const BASE_URL =
  typeof window === "undefined" ? (process.env.INTERNAL_API_URL ?? API_URL) : API_URL

export const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  withXSRFToken: true,
  xsrfCookieName: "XSRF-TOKEN",
  xsrfHeaderName: "X-XSRF-TOKEN",
  headers: {
    Accept: "application/json",
  },
})

export class ApiError extends Error {
  status: number
  errors?: Record<string, string[]>

  constructor(message: string, status: number, errors?: Record<string, string[]>) {
    super(message)
    this.name = "ApiError"
    this.status = status
    this.errors = errors
  }
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    return error.message
  }

  return "Une erreur est survenue. Veuillez réessayer."
}

export function toApiError(error: unknown): ApiError {
  if (error instanceof AxiosError) {
    const status = error.response?.status ?? 0
    const data = error.response?.data as
      | { message?: string; errors?: Record<string, string[]> }
      | undefined
    return new ApiError(data?.message ?? "Une erreur est survenue.", status, data?.errors)
  }
  return new ApiError("Une erreur est survenue.", 0)
}

/** Primes the XSRF-TOKEN cookie Sanctum's SPA auth needs before any state-changing request. */
export async function ensureCsrfCookie(): Promise<void> {
  await api.get("/sanctum/csrf-cookie")
}
