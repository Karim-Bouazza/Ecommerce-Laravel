import { api, ensureCsrfCookie, toApiError } from "@/lib/api"
import type { LoginSchema } from "@/features/auth/schemas/login-schema"
import type { User } from "@/features/auth/types"

export async function login(credentials: LoginSchema): Promise<User> {
  try {
    await ensureCsrfCookie()
    const { data } = await api.post<User>("/api/v1/login", credentials)
    return data
  } catch (error) {
    throw toApiError(error)
  }
}

export async function logout(): Promise<void> {
  try {
    await api.post("/api/v1/logout")
  } catch (error) {
    throw toApiError(error)
  }
}

export async function getCurrentUser(): Promise<User | null> {
  try {
    const { data } = await api.get<User>("/api/v1/me")
    return data
  } catch {
    return null
  }
}
