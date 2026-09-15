import { DeliveryCompaniesTable } from "@/features/partners/components/delivery-companies-table"
import { DeliveryCompanyCards } from "@/features/partners/components/delivery-company-cards"

export function ApiIntegrationPage() {
  return (
    <div className="flex flex-col gap-4">
      <DeliveryCompanyCards />
      <DeliveryCompaniesTable />
    </div>
  )
}
