"use client"

import { keepPreviousData, useQuery } from "@tanstack/react-query"

import { getTransfers, type GetTransfersParams } from "@/features/transfers/api/transfer-api"

export function useTransfers(params: GetTransfersParams) {
  return useQuery({
    queryKey: ["transfers", params],
    queryFn: () => getTransfers(params),
    placeholderData: keepPreviousData,
  })
}
