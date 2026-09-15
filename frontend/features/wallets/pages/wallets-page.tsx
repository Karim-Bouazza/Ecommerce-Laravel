import { WalletStatsCards } from "@/features/wallets/components/wallet-stats-cards"
import { WalletsTable } from "@/features/wallets/components/wallets-table"

export function WalletsPage() {
  return (
    <div className="flex flex-col gap-4">
      <WalletStatsCards />
      <WalletsTable />
    </div>
  )
}
