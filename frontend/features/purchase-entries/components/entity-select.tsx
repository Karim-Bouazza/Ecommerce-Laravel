"use client"

import * as React from "react"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export type EntityOption = {
  id: number
  name: string
}

type EntitySelectProps = {
  value: number | null
  onChange: (value: number) => void
  options: EntityOption[]
  placeholder?: string
  disabled?: boolean
  invalid?: boolean
}

export function EntitySelect({
  value,
  onChange,
  options,
  placeholder = "Sélectionner…",
  disabled,
  invalid,
}: EntitySelectProps) {
  const nameById = React.useMemo(
    () => new Map(options.map((option) => [String(option.id), option.name])),
    [options]
  )

  return (
    <Select
      value={value ? String(value) : undefined}
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
