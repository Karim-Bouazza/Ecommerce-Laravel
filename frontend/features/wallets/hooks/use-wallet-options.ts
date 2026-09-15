"use client"

import { useQuery } from "@tanstack/react-query"

import { getWallets } from "@/features/wallets/api/wallet-api"

export function useWalletOptions() {
  return useQuery({
    queryKey: ["wallets", "options"],
    queryFn: async () => {
      const response = await getWallets({ per_page: 100 })
      return response.data.map((wallet) => ({ id: wallet.id, name: wallet.name }))
    },
  })
}
