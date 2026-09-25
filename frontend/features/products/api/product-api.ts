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

type ProductSpecPayload = {
  label: string
  value: string
}

type BaseProductPayload = {
  name: string
  sku: string | null
  description: string
  short_description: string | null
  category_id: number | null
  brand_id: number | null
  purchase_price: number | null
  price: number
  is_active: boolean
  is_new: boolean
  tags: number[]
  specs: ProductSpecPayload[]
  variants: string[]
}

export type ProductPayload = BaseProductPayload & { image: File }
export type ProductUpdatePayload = BaseProductPayload & { image: File | null }

function toProductFormData(payload: BaseProductPayload & { image: File | null }): FormData {
  const formData = new FormData()
  formData.append("name", payload.name)
  if (payload.sku) {
    formData.append("sku", payload.sku)
  }
  formData.append("description", payload.description)
  if (payload.short_description) {
    formData.append("short_description", payload.short_description)
  }
  if (payload.category_id !== null) {
    formData.append("category_id", String(payload.category_id))
  }
  if (payload.brand_id !== null) {
    formData.append("brand_id", String(payload.brand_id))
  }
  if (payload.purchase_price !== null) {
    formData.append("purchase_price", String(payload.purchase_price))
  }
  formData.append("price", String(payload.price))
  formData.append("is_active", payload.is_active ? "1" : "0")
  formData.append("is_new", payload.is_new ? "1" : "0")
  if (payload.image) {
    formData.append("image", payload.image)
  }
  payload.tags.forEach((tagId) => {
    formData.append("tags[]", String(tagId))
  })
  payload.specs
    .filter((spec) => spec.label.trim() !== "" && spec.value.trim() !== "")
    .forEach((spec, index) => {
      formData.append(`specs[${index}][label]`, spec.label.trim())
      formData.append(`specs[${index}][value]`, spec.value.trim())
    })
  payload.variants
    .map((variant) => variant.trim())
    .filter((variant) => variant !== "")
    .forEach((variant) => {
      formData.append("variants[]", variant)
    })
  return formData
}

export async function createProduct(payload: ProductPayload): Promise<Product> {
  try {
    const { data } = await api.post<Product>("/api/v1/products", toProductFormData(payload))
    return data
  } catch (error) {
    throw toApiError(error)
  }
}

export async function updateProduct(id: number, payload: ProductUpdatePayload): Promise<Product> {
  try {
    const formData = toProductFormData(payload)
    formData.append("_method", "PUT")
    const { data } = await api.post<Product>(`/api/v1/products/${id}`, formData)
    return data
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
