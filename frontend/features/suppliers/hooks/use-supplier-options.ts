"use client"

import { useQuery } from "@tanstack/react-query"

import { getSuppliers } from "@/features/suppliers/api/supplier-api"

export function useSupplierOptions() {
  return useQuery({
    queryKey: ["suppliers", "options"],
    queryFn: async () => {
      const { data: suppliers } = await getSuppliers({ per_page: 100 })
      return suppliers.map((supplier) => ({ id: supplier.id, name: supplier.name }))
    },
  })
}
