"use client"

import { useQuery } from "@tanstack/react-query"

import { getOrderStatusHistory } from "@/features/orders/api/order-api"

export function useOrderStatusHistory(orderId: number, enabled: boolean) {
  return useQuery({
    queryKey: ["orders", orderId, "status-history"],
    queryFn: () => getOrderStatusHistory(orderId),
    enabled,
  })
}
