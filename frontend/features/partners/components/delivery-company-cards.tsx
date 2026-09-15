"use client"

import Image from "next/image"

import { Card } from "@/components/ui/card"
import { DeliveryCompanyIntegrationDialog } from "@/features/partners/components/delivery-company-integration-dialog"
import {
  DELIVERY_COMPANIES,
  type DeliveryCompany,
} from "@/features/partners/constants/delivery-companies"
import { useDeliveryCompanyIntegration } from "@/features/partners/hooks/use-delivery-company-integration"

function DeliveryCompanyCard({ company }: { company: DeliveryCompany }) {
  const { data: integration } = useDeliveryCompanyIntegration(company.key)

  return (
    <DeliveryCompanyIntegrationDialog
      companyKey={company.key}
      entreprise={company.name}
      trigger={
        <Card className="cursor-pointer items-center justify-center transition-colors hover:bg-muted/50" />
      }
      nativeButton={false}
    >
      <div className="relative h-20 w-44">
        <Image
          src={company.logo}
          alt={company.name}
          fill
          sizes="176px"
          className="object-contain"
        />
      </div>
      <div className="flex flex-col items-center gap-0.5 text-center">
        <span className="text-sm font-medium">{company.name}</span>
        <span className="text-xs text-muted-foreground">
          {integration?.name || "Non configuré"}
        </span>
      </div>
    </DeliveryCompanyIntegrationDialog>
  )
}

export function DeliveryCompanyCards() {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {DELIVERY_COMPANIES.map((company) => (
        <DeliveryCompanyCard key={company.key} company={company} />
      ))}
    </div>
  )
}
