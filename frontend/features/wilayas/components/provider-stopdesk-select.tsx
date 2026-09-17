"use client"

import * as React from "react"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useProviderStopDesks } from "@/features/wilayas/hooks/use-provider-stopdesks"

type ProviderStopDeskSelectProps = {
  providerWilayaId: number | null
  providerCommuneId: number | null
  value: string | null
  onChange: (officeId: string) => void
  placeholder?: string
  invalid?: boolean
}

const amountFormatter = new Intl.NumberFormat("fr-FR")

export function ProviderStopDeskSelect({
  providerWilayaId,
  providerCommuneId,
  value,
  onChange,
  placeholder = "Stop desk",
  invalid,
}: ProviderStopDeskSelectProps) {
  const { data: stopDesks = [] } = useProviderStopDesks(providerWilayaId, providerCommuneId)
  const labelById = React.useMemo(
    () =>
      new Map(
        stopDesks.map((office) => [
          office.office_id,
          `${office.name} - ${amountFormatter.format(office.price)}DA${
            office.address ? ` (${office.address})` : ""
          }`,
        ])
      ),
    [stopDesks]
  )

  return (
    <Select
      value={value !== null ? value : null}
      onValueChange={(next) => {
        if (next === null) return
        onChange(next)
      }}
      disabled={providerWilayaId === null || providerCommuneId === null}
    >
      <SelectTrigger className="w-full" aria-invalid={invalid}>
        <SelectValue placeholder={placeholder}>
          {(selected: string | null) => (selected ? (labelById.get(selected) ?? selected) : placeholder)}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {stopDesks.map((office, index) => (
          <React.Fragment key={office.office_id}>
            {index > 0 && <SelectSeparator />}
            <SelectItem value={office.office_id} className="items-start py-2.5">
              {labelById.get(office.office_id)}
            </SelectItem>
          </React.Fragment>
        ))}
      </SelectContent>
    </Select>
  )
}
