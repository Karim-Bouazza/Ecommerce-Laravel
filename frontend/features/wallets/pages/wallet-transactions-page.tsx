import Link from "next/link"
import { ChevronLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { WalletTransactionsTable } from "@/features/wallets/components/wallet-transactions-table"

export function WalletTransactionsPage({ walletId }: { walletId: number }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-lg font-semibold">Transactions</h1>
        <Button variant="outline" nativeButton={false} render={<Link href="/admin/finances/wallets" />}>
          <ChevronLeft className="size-4" />
          Retour
        </Button>
      </div>

      <WalletTransactionsTable walletId={walletId} />
    </div>
  )
}
