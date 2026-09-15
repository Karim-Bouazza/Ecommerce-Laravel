"use client"

import * as React from "react"
import { cn } from "cn"

import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxCollection,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  useComboboxAnchor,
} from "@/components/ui/combobox"

export type MultiSelectOption = {
  id: number
  name: string
}

type MultiSelectComboboxProps = {
  value: number[]
  onChange: (value: number[]) => void
  options: MultiSelectOption[]
  placeholder?: string
  emptyMessage?: string
  disabled?: boolean
  invalid?: boolean
  className?: string
}

export function MultiSelectCombobox({
  value,
  onChange,
  options,
  placeholder = "Sélectionner…",
  emptyMessage = "Aucun résultat.",
  disabled,
  invalid,
  className,
}: MultiSelectComboboxProps) {
  const anchor = useComboboxAnchor()

  const labelById = React.useMemo(
    () => new Map(options.map((option) => [option.id, option.name])),
    [options]
  )

  return (
    <Combobox
      items={options.map((option) => option.id)}
      multiple
      value={value}
      onValueChange={(next) => onChange(next)}
      itemToStringLabel={(id: number) => labelById.get(id) ?? ""}
      disabled={disabled}
    >
      <ComboboxChips
        ref={anchor}
        className={cn(invalid && "border-destructive ring-3 ring-destructive/20", className)}
      >
        {value.map((id) => (
          <ComboboxChip key={id}>{labelById.get(id) ?? id}</ComboboxChip>
        ))}
        <ComboboxChipsInput placeholder={value.length === 0 ? placeholder : undefined} />
      </ComboboxChips>
      <ComboboxContent anchor={anchor}>
        <ComboboxEmpty>{emptyMessage}</ComboboxEmpty>
        <ComboboxList>
          <ComboboxCollection>
            {(id: number) => (
              <ComboboxItem key={id} value={id}>
                {labelById.get(id) ?? id}
              </ComboboxItem>
            )}
          </ComboboxCollection>
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  )
}
