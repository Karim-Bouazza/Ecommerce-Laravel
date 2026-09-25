"use client"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useBrands } from "@/features/brands/hooks/use-brands"

type BrandSelectProps = {
  value: number | null
  onChange: (value: number | null) => void
  placeholder?: string
  disabled?: boolean
  invalid?: boolean
}

const NONE_VALUE = "__none__"

export function BrandSelect({
  value,
  onChange,
  placeholder = "Sélectionner une marque",
  disabled,
  invalid,
}: BrandSelectProps) {
  const { data: brands = [] } = useBrands()
  const noneLabel = "Aucune marque"
  const labelByValue = new Map<string, string>([
    [NONE_VALUE, noneLabel],
    ...brands.map((brand): [string, string] => [String(brand.id), brand.name]),
  ])

  return (
    <Select
      value={value !== null ? String(value) : NONE_VALUE}
      onValueChange={(next) => onChange(next === NONE_VALUE ? null : Number(next))}
      disabled={disabled}
    >
      <SelectTrigger className="w-full" aria-invalid={invalid}>
        <SelectValue placeholder={placeholder}>
          {(val: string | null) => (val ? (labelByValue.get(val) ?? val) : placeholder)}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={NONE_VALUE}>Aucune marque</SelectItem>
        {brands.map((brand) => (
          <SelectItem key={brand.id} value={String(brand.id)}>
            {brand.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
