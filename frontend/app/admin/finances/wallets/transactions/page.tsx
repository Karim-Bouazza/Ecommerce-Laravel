"use client"

import { Suspense } from "react"
import { useSearchParams } from "next/navigation"

import { WalletTransactionsPage } from "@/features/wallets/pages/wallet-transactions-page"

function WalletTransactionsContent() {
  const searchParams = useSearchParams()
  const walletId = Number(searchParams.get("walletId"))

  return <WalletTransactionsPage walletId={walletId} />
}

export default function Page() {
  return (
    <Suspense fallback={null}>
      <WalletTransactionsContent />
    </Suspense>
  )
}
