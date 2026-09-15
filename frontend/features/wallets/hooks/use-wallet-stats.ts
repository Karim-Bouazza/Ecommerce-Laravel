"use client"

import { useQuery } from "@tanstack/react-query"

import { getWalletStats } from "@/features/wallets/api/wallet-api"

export function useWalletStats() {
  return useQuery({
    queryKey: ["wallet-stats"],
    queryFn: getWalletStats,
  })
}
