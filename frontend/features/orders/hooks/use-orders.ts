"use client"

import { keepPreviousData, useQuery } from "@tanstack/react-query"

import { getOrders, type GetOrdersParams } from "@/features/orders/api/order-api"

export function useOrders(params: GetOrdersParams) {
  return useQuery({
    queryKey: ["orders", params],
    queryFn: () => getOrders(params),
    placeholderData: keepPreviousData,
  })
}
