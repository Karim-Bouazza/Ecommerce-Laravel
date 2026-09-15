export type User = {
  id: number
  name: string
  email: string
  phone: string | null
  role: {
    id: number
    name: string
    is_system: boolean
    permissions: string[]
  } | null
}
