"use client"

import { keepPreviousData, useQuery } from "@tanstack/react-query"

import { getWallets, type GetWalletsParams } from "@/features/wallets/api/wallet-api"

export function useWallets(params: GetWalletsParams) {
  return useQuery({
    queryKey: ["wallets", params],
    queryFn: () => getWallets(params),
    placeholderData: keepPreviousData,
  })
}
