"use client"

import * as React from "react"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useWalletOptions } from "@/features/wallets/hooks/use-wallet-options"

type WalletSelectProps = {
  value: number | null
  onChange: (value: number) => void
  excludeId?: number | null
  placeholder?: string
  disabled?: boolean
  invalid?: boolean
}

export function WalletSelect({
  value,
  onChange,
  excludeId,
  placeholder = "Portefeuille",
  disabled,
  invalid,
}: WalletSelectProps) {
  const { data: options = [] } = useWalletOptions()
  const available = options.filter((option) => option.id !== excludeId)
  const nameById = React.useMemo(
    () => new Map(available.map((option) => [String(option.id), option.name])),
    [available]
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
        {available.map((option) => (
          <SelectItem key={option.id} value={String(option.id)}>
            {option.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
