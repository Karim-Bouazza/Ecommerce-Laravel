"use client"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useCategories } from "@/features/categories/hooks/use-categories"

type CategorySelectProps = {
  value: number | null
  onChange: (value: number) => void
  placeholder?: string
  disabled?: boolean
  invalid?: boolean
  excludeIds?: number[]
}

export function CategorySelect({
  value,
  onChange,
  placeholder = "Sélectionner une catégorie",
  disabled,
  invalid,
  excludeIds,
}: CategorySelectProps) {
  const { data: allCategories = [] } = useCategories()
  const categories = excludeIds
    ? allCategories.filter((category) => !excludeIds.includes(category.id))
    : allCategories
  const labelById = new Map(categories.map((category) => [String(category.id), category.name]))

  return (
    <Select
      value={value !== null ? String(value) : undefined}
      onValueChange={(next) => onChange(Number(next))}
      disabled={disabled}
    >
      <SelectTrigger className="w-full" aria-invalid={invalid}>
        <SelectValue placeholder={placeholder}>
          {(val: string | null) => (val ? (labelById.get(val) ?? val) : placeholder)}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {categories.map((category) => (
          <SelectItem key={category.id} value={String(category.id)}>
            {category.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
