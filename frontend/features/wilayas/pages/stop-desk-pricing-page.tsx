"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { StopDeskPriceRow } from "@/features/wilayas/components/stop-desk-price-row"
import { useWilayas } from "@/features/wilayas/hooks/use-wilayas"

export function StopDeskPricingPage() {
  const { data, isLoading } = useWilayas()

  if (isLoading || !data) {
    return <Skeleton className="h-96 w-full max-w-3xl" />
  }

  return (
    <Card className="max-w-3xl">
      <CardHeader>
        <CardTitle>Prix Stop Desk par wilaya — {data.length}</CardTitle>
        <CardDescription>
          Définissez le prix de livraison Stop Desk pour chaque wilaya. La liste affiche toutes
          les wilayas, sans pagination.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Wilaya</TableHead>
                <TableHead>Prix Stop Desk</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((wilaya) => (
                <StopDeskPriceRow key={wilaya.id} wilaya={wilaya} />
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
