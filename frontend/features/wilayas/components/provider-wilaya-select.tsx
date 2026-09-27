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
import { useProviderWilayas } from "@/features/wilayas/hooks/use-provider-wilayas"

type ProviderWilayaSelectProps = {
  value: number | null
  onChange: (providerWilayaId: number, matchedWilayaId: number | null) => void
  placeholder?: string
  disabled?: boolean
  invalid?: boolean
  className?: string
  arabic?: boolean
}

export function ProviderWilayaSelect({
  value,
  onChange,
  placeholder = "Wilaya",
  disabled,
  invalid,
  className,
  arabic = false,
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
      <SelectTrigger dir={arabic ? "rtl" : "ltr"} className={cn("w-full", className)} aria-invalid={invalid}>
        <SelectValue placeholder={placeholder}>
          {(selected: string | null) => {
            const item = selected ? byId.get(selected) : undefined
            return item ? (arabic ? item.name_ar ?? item.name : item.name) : placeholder
          }}
        </SelectValue>
      </SelectTrigger>
      <SelectContent dir={arabic ? "rtl" : "ltr"}>
        {providerWilayas.map((wilaya) => (
          <SelectItem key={wilaya.id} value={String(wilaya.id)} className="py-2.5 text-base">
            {arabic ? wilaya.name_ar ?? wilaya.name : wilaya.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
