"use client"

import { keepPreviousData, useQuery } from "@tanstack/react-query"

import { getSuppliers, type GetSuppliersParams } from "@/features/suppliers/api/supplier-api"

export function useSuppliers(params: GetSuppliersParams) {
  return useQuery({
    queryKey: ["suppliers", params],
    queryFn: () => getSuppliers(params),
    placeholderData: keepPreviousData,
  })
}
