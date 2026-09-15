import { api, toApiError } from "@/lib/api"
import type {
  Order,
  OrderStatusGroup,
  OrderStatusHistoryEntry,
  PaginatedResponse,
} from "@/features/orders/types"

export type GetOrdersParams = {
  page?: number
  per_page?: number
  search?: string
  status_group?: OrderStatusGroup
}

export async function getOrders(params: GetOrdersParams): Promise<PaginatedResponse<Order>> {
  try {
    const { data } = await api.get<PaginatedResponse<Order>>("/api/v1/orders", { params })
    return data
  } catch (error) {
    throw toApiError(error)
  }
}

export type OrderItemPayload = {
  warehouse_id: number
  product_id: number
  variant?: string
  quantity: number
  unit_price?: number
}

export type CreateOrderPayload = {
  first_name: string
  last_name: string
  phone_number: string
  wilaya_id: number
  commune_id: number
  address?: string
  delivery_type: "domicile" | "stop_desk"
  stop_desk_company_id?: number
  delivery_price?: number
  delivery_note?: string
  items: OrderItemPayload[]
}

export async function createManualOrder(payload: CreateOrderPayload): Promise<Order> {
  try {
    const { data } = await api.post<Order>("/api/v1/orders/manual", payload)
    return data
  } catch (error) {
    throw toApiError(error)
  }
}

export type UpdateOrderItemPayload = OrderItemPayload & {
  id?: number
}

export type UpdateOrderPayload = Omit<CreateOrderPayload, "items"> & {
  items: UpdateOrderItemPayload[]
}

export async function updateManualOrder(id: number, payload: UpdateOrderPayload): Promise<Order> {
  try {
    const { data } = await api.put<Order>(`/api/v1/orders/${id}`, payload)
    return data
  } catch (error) {
    throw toApiError(error)
  }
}

export async function deleteOrder(id: number): Promise<void> {
  try {
    await api.delete(`/api/v1/orders/${id}`)
  } catch (error) {
    throw toApiError(error)
  }
}

export async function updateOrderStatus(id: number, status: string): Promise<Order> {
  try {
    const { data } = await api.patch<Order>(`/api/v1/orders/${id}/status`, { status })
    return data
  } catch (error) {
    throw toApiError(error)
  }
}

export async function getOrderStatusHistory(id: number): Promise<OrderStatusHistoryEntry[]> {
  try {
    const { data } = await api.get<OrderStatusHistoryEntry[]>(`/api/v1/orders/${id}/status-history`)
    return data
  } catch (error) {
    throw toApiError(error)
  }
}
