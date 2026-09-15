import { api, toApiError } from "@/lib/api"
import type { CreateWalletSchema } from "@/features/wallets/schemas/create-wallet-schema"
import type {
  PaginatedResponse,
  Wallet,
  WalletStats,
  WalletTransaction,
  WalletTransactionCategory,
} from "@/features/wallets/types"

export async function getWalletStats(): Promise<WalletStats> {
  try {
    const { data } = await api.get<WalletStats>("/api/v1/wallets/stats")
    return data
  } catch (error) {
    throw toApiError(error)
  }
}

export type GetWalletsParams = {
  page?: number
  per_page?: number
  search?: string
}

export async function getWallets(params: GetWalletsParams): Promise<PaginatedResponse<Wallet>> {
  try {
    const { data } = await api.get<PaginatedResponse<Wallet>>("/api/v1/wallets", { params })
    return data
  } catch (error) {
    throw toApiError(error)
  }
}

export async function createWallet(payload: CreateWalletSchema): Promise<Wallet> {
  try {
    const { data } = await api.post<{ data: Wallet }>("/api/v1/wallets", payload)
    return data.data
  } catch (error) {
    throw toApiError(error)
  }
}

export async function updateWallet(id: number, payload: CreateWalletSchema): Promise<Wallet> {
  try {
    const { data } = await api.put<{ data: Wallet }>(`/api/v1/wallets/${id}`, payload)
    return data.data
  } catch (error) {
    throw toApiError(error)
  }
}

export type DepositToWalletPayload = {
  date: string
  amount: number
  remark?: string
}

export async function depositToWallet(
  walletId: number,
  payload: DepositToWalletPayload
): Promise<void> {
  try {
    await api.post(`/api/v1/wallets/${walletId}/deposit`, payload)
  } catch (error) {
    throw toApiError(error)
  }
}

export type WithdrawFromWalletPayload = {
  date: string
  amount: number
  remark?: string
}

export async function withdrawFromWallet(
  walletId: number,
  payload: WithdrawFromWalletPayload
): Promise<void> {
  try {
    await api.post(`/api/v1/wallets/${walletId}/withdraw`, payload)
  } catch (error) {
    throw toApiError(error)
  }
}

export async function deleteWallet(id: number): Promise<void> {
  try {
    await api.delete(`/api/v1/wallets/${id}`)
  } catch (error) {
    throw toApiError(error)
  }
}

export type GetWalletTransactionsParams = {
  page?: number
  per_page?: number
  category?: WalletTransactionCategory | "all"
  search?: string
}

export async function getWalletTransactions(
  walletId: number,
  params: GetWalletTransactionsParams
): Promise<PaginatedResponse<WalletTransaction>> {
  try {
    const { data } = await api.get<PaginatedResponse<WalletTransaction>>(
      `/api/v1/wallets/${walletId}/transactions`,
      { params }
    )
    return data
  } catch (error) {
    throw toApiError(error)
  }
}

export type TransferWalletsPayload = {
  date: string
  from_wallet_id: number
  to_wallet_id: number
  amount: number
  remark?: string
}

export async function transferBetweenWallets(payload: TransferWalletsPayload): Promise<void> {
  try {
    await api.post("/api/v1/wallets/transfer", payload)
  } catch (error) {
    throw toApiError(error)
  }
}
