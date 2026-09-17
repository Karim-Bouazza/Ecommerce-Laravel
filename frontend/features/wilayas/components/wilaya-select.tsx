"use client"

import * as React from "react"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useWilayas } from "@/features/wilayas/hooks/use-wilayas"

type WilayaSelectProps = {
  value: number | null
  onChange: (value: number) => void
  placeholder?: string
  disabled?: boolean
  invalid?: boolean
}

export function WilayaSelect({
  value,
  onChange,
  placeholder = "Wilaya",
  disabled,
  invalid,
}: WilayaSelectProps) {
  const { data: wilayas = [] } = useWilayas()
  const nameById = React.useMemo(
    () => new Map(wilayas.map((wilaya) => [String(wilaya.id), wilaya.name])),
    [wilayas]
  )

  return (
    <Select
      value={value !== null ? String(value) : null}
      onValueChange={(next) => onChange(Number(next))}
      disabled={disabled}
    >
      <SelectTrigger className="w-full" aria-invalid={invalid}>
        <SelectValue placeholder={placeholder}>
          {(selected: string | null) => (selected ? (nameById.get(selected) ?? selected) : placeholder)}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {wilayas.map((wilaya) => (
          <SelectItem key={wilaya.id} value={String(wilaya.id)}>
            {wilaya.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
