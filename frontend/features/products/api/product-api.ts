import { api, toApiError } from "@/lib/api"
import type { PaginatedResponse, Product } from "@/features/products/types"

export type GetProductsParams = {
  page?: number
  per_page?: number
  search?: string
}

export async function getProducts(
  params: GetProductsParams
): Promise<PaginatedResponse<Product>> {
  try {
    const { data } = await api.get<PaginatedResponse<Product>>("/api/v1/products", { params })
    return data
  } catch (error) {
    throw toApiError(error)
  }
}

type BaseProductPayload = {
  name: string
  description: string
  category_id: number | null
  purchase_price: number | null
  price: number
  is_active: boolean
}

export type ProductPayload = BaseProductPayload & { image: File }
export type ProductUpdatePayload = BaseProductPayload & { image: File | null }

function toProductFormData(payload: BaseProductPayload & { image: File | null }): FormData {
  const formData = new FormData()
  formData.append("name", payload.name)
  formData.append("description", payload.description)
  if (payload.category_id !== null) {
    formData.append("category_id", String(payload.category_id))
  }
  if (payload.purchase_price !== null) {
    formData.append("purchase_price", String(payload.purchase_price))
  }
  formData.append("price", String(payload.price))
  formData.append("is_active", payload.is_active ? "1" : "0")
  if (payload.image) {
    formData.append("image", payload.image)
  }
  return formData
}

export async function createProduct(payload: ProductPayload): Promise<Product> {
  try {
    const { data } = await api.post<{ data: Product }>(
      "/api/v1/products",
      toProductFormData(payload)
    )
    return data.data
  } catch (error) {
    throw toApiError(error)
  }
}

export async function updateProduct(id: number, payload: ProductUpdatePayload): Promise<Product> {
  try {
    const formData = toProductFormData(payload)
    formData.append("_method", "PUT")
    const { data } = await api.post<{ data: Product }>(`/api/v1/products/${id}`, formData)
    return data.data
  } catch (error) {
    throw toApiError(error)
  }
}

export async function deleteProduct(id: number): Promise<void> {
  try {
    await api.delete(`/api/v1/products/${id}`)
  } catch (error) {
    throw toApiError(error)
  }
}
