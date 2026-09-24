"use client"

import { keepPreviousData, useQuery } from "@tanstack/react-query"

import { getCharges, type GetChargesParams } from "@/features/charges/api/charge-api"

export function useCharges(params: GetChargesParams) {
  return useQuery({
    queryKey: ["charges", params],
    queryFn: () => getCharges(params),
    placeholderData: keepPreviousData,
  })
}
