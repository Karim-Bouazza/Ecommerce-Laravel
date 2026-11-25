"use client"

import { useQuery } from "@tanstack/react-query"

import { getOrder } from "@/features/orders/api/order-api"

export function useOrder(orderId: number, enabled: boolean) {
  return useQuery({
    queryKey: ["orders", orderId, "details"],
    queryFn: () => getOrder(orderId),
    enabled,
  })
}
