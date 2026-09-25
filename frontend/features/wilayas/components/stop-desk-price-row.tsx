"use client"

import * as React from "react"
import { Save } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { TableCell, TableRow } from "@/components/ui/table"
import { useUpdateWilayaStopDeskPrice } from "@/features/wilayas/hooks/use-update-wilaya-stop-desk-price"
import type { Wilaya } from "@/features/wilayas/types"

export function StopDeskPriceRow({ wilaya }: { wilaya: Wilaya }) {
  const [price, setPrice] = React.useState(String(wilaya.price_stop_desk))
  const mutation = useUpdateWilayaStopDeskPrice()

  React.useEffect(() => {
    setPrice(String(wilaya.price_stop_desk))
  }, [wilaya.price_stop_desk])

  const parsed = Number(price)
  const isValid = price.trim() !== "" && Number.isInteger(parsed) && parsed >= 0
  const isDirty = isValid && parsed !== wilaya.price_stop_desk

  function save() {
    if (!isDirty) return
    mutation.mutate({ id: wilaya.id, price_stop_desk: parsed })
  }

  return (
    <TableRow>
      <TableCell>{wilaya.code}</TableCell>
      <TableCell className="font-medium">{wilaya.name}</TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <Input
            type="number"
            min={0}
            step={1}
            inputMode="numeric"
            value={price}
            onChange={(event) => setPrice(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") save()
            }}
            className="w-28"
            aria-invalid={!isValid}
            disabled={mutation.isPending}
          />
          <span className="text-sm text-muted-foreground">DZD</span>
          <Button
            type="button"
            size="icon-sm"
            variant="ghost"
            aria-label="Enregistrer"
            onClick={save}
            disabled={!isDirty || mutation.isPending}
          >
            <Save />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  )
}
