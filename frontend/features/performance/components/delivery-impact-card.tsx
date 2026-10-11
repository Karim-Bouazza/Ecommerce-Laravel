import { Truck } from "lucide-react"

import { ComingSoonRow, PerformanceCard } from "@/features/performance/components/performance-card"

export function DeliveryImpactCard() {
  return (
    <PerformanceCard title="Impact de Livraison" icon={Truck} tone="sky">
      <ComingSoonRow label="Écart des Frais de Livraison" />
      <ComingSoonRow label="Écart des Frais de Livraison par Livré" />
    </PerformanceCard>
  )
}
