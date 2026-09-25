"use client"

import * as React from "react"
import { cn } from "cn"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useProviderCommunes } from "@/features/wilayas/hooks/use-provider-communes"

type ProviderCommuneSelectProps = {
  providerWilayaId: number | null
  value: number | null
  onChange: (providerCommuneId: number) => void
  placeholder?: string
  invalid?: boolean
  className?: string
}

export function ProviderCommuneSelect({
  providerWilayaId,
  value,
  onChange,
  placeholder = "Commune",
  invalid,
  className,
}: ProviderCommuneSelectProps) {
  const { data: providerCommunes = [] } = useProviderCommunes(providerWilayaId)
  const nameById = React.useMemo(
    () => new Map(providerCommunes.map((commune) => [String(commune.id), commune.name])),
    [providerCommunes]
  )

  return (
    <Select
      value={value !== null ? String(value) : null}
      onValueChange={(next) => {
        if (next === null) return
        onChange(Number(next))
      }}
      disabled={providerWilayaId === null}
    >
      <SelectTrigger className={cn("w-full", className)} aria-invalid={invalid}>
        <SelectValue placeholder={placeholder}>
          {(selected: string | null) => (selected ? (nameById.get(selected) ?? selected) : placeholder)}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {providerCommunes.map((commune) => (
          <SelectItem key={commune.id} value={String(commune.id)}>
            {commune.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
