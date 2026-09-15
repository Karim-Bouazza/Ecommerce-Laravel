import { VersementStatsCards } from "@/features/versements/components/versement-stats-cards"
import { VersementsTable } from "@/features/versements/components/versements-table"

export function VersementsPage() {
  return (
    <div className="flex flex-col gap-4">
      <VersementStatsCards />
      <VersementsTable />
    </div>
  )
}
