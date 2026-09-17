"use client"

import * as React from "react"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useProviderWilayas } from "@/features/wilayas/hooks/use-provider-wilayas"

type ProviderWilayaSelectProps = {
  value: number | null
  onChange: (providerWilayaId: number, matchedWilayaId: number | null) => void
  placeholder?: string
  disabled?: boolean
  invalid?: boolean
}

export function ProviderWilayaSelect({
  value,
  onChange,
  placeholder = "Wilaya",
  disabled,
  invalid,
}: ProviderWilayaSelectProps) {
  const { data: providerWilayas = [] } = useProviderWilayas()
  const byId = React.useMemo(
    () => new Map(providerWilayas.map((wilaya) => [String(wilaya.id), wilaya])),
    [providerWilayas]
  )

  return (
    <Select
      value={value !== null ? String(value) : null}
      onValueChange={(next) => {
        if (next === null) return
        const selected = byId.get(next)
        onChange(Number(next), selected?.wilaya_id ?? null)
      }}
      disabled={disabled}
    >
      <SelectTrigger className="w-full" aria-invalid={invalid}>
        <SelectValue placeholder={placeholder}>
          {(selected: string | null) => (selected ? (byId.get(selected)?.name ?? selected) : placeholder)}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {providerWilayas.map((wilaya) => (
          <SelectItem key={wilaya.id} value={String(wilaya.id)}>
            {wilaya.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
