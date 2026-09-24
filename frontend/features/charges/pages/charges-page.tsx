import { ChargesStatsCards } from "@/features/charges/components/charges-stats-cards"
import { ChargesTable } from "@/features/charges/components/charges-table"

export function ChargesPage() {
  return (
    <div className="flex flex-col gap-4">
      <ChargesStatsCards />
      <ChargesTable />
    </div>
  )
}
