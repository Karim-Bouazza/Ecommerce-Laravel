"use client"

import { useQuery } from "@tanstack/react-query"

import { getWarehouses } from "@/features/warehouses/api/warehouse-api"

export function useWarehouseOptions() {
  return useQuery({
    queryKey: ["warehouses", "options"],
    queryFn: async () => {
      const { data: warehouses } = await getWarehouses({ per_page: 100 })
      return warehouses.map((warehouse) => ({ id: warehouse.id, name: warehouse.name }))
    },
  })
}
