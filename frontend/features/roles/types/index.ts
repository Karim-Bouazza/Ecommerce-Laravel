export type Role = {
  id: number
  name: string
  slug: string
  is_system: boolean
  permissions: string[]
}

export type PermissionItem = {
  key: string
  label: string
  granted: boolean
}

export type PermissionGroup = {
  group: string
  permissions: PermissionItem[]
}

export type RoleDetail = {
  id: number
  name: string
  slug: string
  is_system: boolean
  permission_groups: PermissionGroup[]
}

export type PermissionCatalogueItem = {
  key: string
  label: string
}

export type PermissionCatalogueGroup = {
  group: string
  permissions: PermissionCatalogueItem[]
}

export type PaginatedResponse<T> = {
  data: T[]
  meta: {
    current_page: number
    last_page: number
    per_page: number
    total: number
  }
}
