"use client"

import { keepPreviousData, useQuery } from "@tanstack/react-query"

import { getWarehouses, type GetWarehousesParams } from "@/features/warehouses/api/warehouse-api"

export function useWarehouses(params: GetWarehousesParams) {
  return useQuery({
    queryKey: ["warehouses", params],
    queryFn: () => getWarehouses(params),
    placeholderData: keepPreviousData,
  })
}
