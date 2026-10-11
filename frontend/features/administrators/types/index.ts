export type AdministratorRole = {
  id: number
  name: string
  is_system: boolean
}

export type Administrator = {
  id: number
  name: string
  email: string
  phone: string | null
  avatar: string | null
  is_active: boolean
  is_current: boolean
  role: AdministratorRole | null
  created_at: string | null
}

export type AdministratorStatusFilter = "active" | "inactive"

export type PaginatedResponse<T> = {
  data: T[]
  meta: {
    current_page: number
    last_page: number
    per_page: number
    total: number
  }
}
