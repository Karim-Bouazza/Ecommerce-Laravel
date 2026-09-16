import axios, { AxiosError } from "axios"

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000"

export const api = axios.create({
  baseURL: API_URL,
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
