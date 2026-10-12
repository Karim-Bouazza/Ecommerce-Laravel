"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { OrderStatusBreakdown } from "@/features/order-analysis/types"

const percentFormatter = new Intl.NumberFormat("fr-FR", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

export function StatusBreakdownTable({ data }: { data: OrderStatusBreakdown | undefined }) {
  return (
    <Card>
      <CardContent>
        <div className="max-h-96 overflow-auto rounded-lg border">
          <Table>
            <TableHeader className="sticky top-0 bg-muted">
              <TableRow className="hover:bg-muted">
                <TableHead>Type de statut</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Nombre de commandes</TableHead>
                <TableHead className="text-right">Pourcentage</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data === undefined
                ? Array.from({ length: 6 }, (_, index) => (
                    <TableRow key={index}>
                      <TableCell colSpan={4}>
                        <Skeleton className="h-5 w-full" />
                      </TableCell>
                    </TableRow>
                  ))
                : data.groups.flatMap((group) =>
                    group.statuses.map((status) => (
                      <TableRow key={`${group.key}-${status.status}`}>
                        <TableCell className="text-muted-foreground">{group.label}</TableCell>
                        <TableCell className="font-medium">{status.label}</TableCell>
                        <TableCell className="text-right tabular-nums">{status.count}</TableCell>
                        <TableCell className="text-right tabular-nums">
                          {percentFormatter.format(status.percentage)} %
                        </TableCell>
                      </TableRow>
                    ))
                  )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
