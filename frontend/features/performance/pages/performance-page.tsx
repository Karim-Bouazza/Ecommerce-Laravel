import { RevenueProfitCard } from "@/features/performance/components/revenue-profit-card"

export function PerformancePage() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <RevenueProfitCard />
    </div>
  )
}
