"use client"

import * as React from "react"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useSupplierOptions } from "@/features/suppliers/hooks/use-supplier-options"

type FournisseurSelectProps = {
  value: number | null
  onChange: (value: number) => void
  placeholder?: string
  disabled?: boolean
  invalid?: boolean
}

export function FournisseurSelect({
  value,
  onChange,
  placeholder = "Fournisseur",
  disabled,
  invalid,
}: FournisseurSelectProps) {
  const { data: options = [] } = useSupplierOptions()
  const nameById = React.useMemo(
    () => new Map(options.map((option) => [String(option.id), option.name])),
    [options]
  )

  return (
    <Select
      value={value !== null ? String(value) : undefined}
      onValueChange={(next) => onChange(Number(next))}
      disabled={disabled}
    >
      <SelectTrigger className="w-full" aria-invalid={invalid}>
        <SelectValue placeholder={placeholder}>
          {(selected: string | null) => (selected ? (nameById.get(selected) ?? selected) : placeholder)}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.id} value={String(option.id)}>
            {option.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
