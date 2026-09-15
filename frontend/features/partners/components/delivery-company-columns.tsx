"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { Settings2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { DeleteDeliveryCompanyIntegrationDialog } from "@/features/partners/components/delete-delivery-company-integration-dialog"
import { DeliveryCompanyIntegrationDialog } from "@/features/partners/components/delivery-company-integration-dialog"
import type { DeliveryCompanyIntegrationListItem } from "@/features/partners/types"

export const deliveryCompanyColumns: ColumnDef<DeliveryCompanyIntegrationListItem>[] = [
  {
    accessorKey: "entreprise",
    header: "Entreprise",
    meta: { className: "w-1/3" },
  },
  {
    accessorKey: "name",
    header: "Nom",
    cell: ({ row }) =>
      row.original.name || <span className="text-muted-foreground">Non configuré</span>,
    meta: { className: "w-1/3" },
  },
  {
    id: "actions",
    header: "Action",
    meta: { className: "w-1/3" },
    cell: ({ row }) => (
      <div className="flex items-center justify-center gap-1">
        <DeliveryCompanyIntegrationDialog
          companyKey={row.original.company_key}
          entreprise={row.original.entreprise}
          trigger={<Button variant="ghost" size="icon" aria-label="Configurer" />}
        >
          <Settings2 className="size-4" />
        </DeliveryCompanyIntegrationDialog>
        <DeleteDeliveryCompanyIntegrationDialog
          companyKey={row.original.company_key}
          entreprise={row.original.entreprise}
        />
      </div>
    ),
  },
]
