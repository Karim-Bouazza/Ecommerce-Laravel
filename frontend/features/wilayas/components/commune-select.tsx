"use client"

import * as React from "react"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useWilayaCommunes } from "@/features/wilayas/hooks/use-wilaya-communes"

type CommuneSelectProps = {
  wilayaId: number | null
  value: number | null
  onChange: (value: number) => void
  placeholder?: string
  invalid?: boolean
}

export function CommuneSelect({
  wilayaId,
  value,
  onChange,
  placeholder = "Commune",
  invalid,
}: CommuneSelectProps) {
  const { data: communes = [] } = useWilayaCommunes(wilayaId)
  const nameById = React.useMemo(
    () => new Map(communes.map((commune) => [String(commune.id), commune.name])),
    [communes]
  )

  return (
    <Select
      value={value !== null ? String(value) : undefined}
      onValueChange={(next) => onChange(Number(next))}
      disabled={wilayaId === null}
    >
      <SelectTrigger className="w-full" aria-invalid={invalid}>
        <SelectValue placeholder={placeholder}>
          {(selected: string | null) => (selected ? (nameById.get(selected) ?? selected) : placeholder)}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {communes.map((commune) => (
          <SelectItem key={commune.id} value={String(commune.id)}>
            {commune.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
