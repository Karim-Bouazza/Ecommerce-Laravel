"use client"

import { keepPreviousData, useQuery } from "@tanstack/react-query"

import {
  getWalletTransactions,
  type GetWalletTransactionsParams,
} from "@/features/wallets/api/wallet-api"

export function useWalletTransactions(walletId: number, params: GetWalletTransactionsParams) {
  return useQuery({
    queryKey: ["wallets", walletId, "transactions", params],
    queryFn: () => getWalletTransactions(walletId, params),
    placeholderData: keepPreviousData,
  })
}
