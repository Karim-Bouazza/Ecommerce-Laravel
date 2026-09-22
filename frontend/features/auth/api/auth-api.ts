import { api, ensureCsrfCookie, toApiError } from "@/lib/api"
import type { LoginSchema } from "@/features/auth/schemas/login-schema"
import type { ProfileFormOutput } from "@/features/auth/schemas/profile-schema"
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

function toProfileFormData(payload: ProfileFormOutput): FormData {
  const formData = new FormData()
  formData.append("name", payload.name)
  formData.append("email", payload.email)
  formData.append("phone", payload.phone)
  if (payload.avatar) {
    formData.append("avatar", payload.avatar)
  }
  if (payload.password) {
    formData.append("current_password", payload.current_password ?? "")
    formData.append("password", payload.password)
    formData.append("password_confirmation", payload.password_confirmation ?? "")
  }
  return formData
}

export async function updateProfile(payload: ProfileFormOutput): Promise<User> {
  try {
    const formData = toProfileFormData(payload)
    formData.append("_method", "PUT")
    const { data } = await api.post<User>("/api/v1/me", formData)
    return data
  } catch (error) {
    throw toApiError(error)
  }
}
