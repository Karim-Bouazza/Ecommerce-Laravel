"use client";

import * as React from "react";
import { cn } from "cn";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useProviderCommunes } from "@/features/wilayas/hooks/use-provider-communes";

type ProviderCommuneSelectProps = {
  providerWilayaId: number | null;
  value: number | null;
  onChange: (providerCommuneId: number) => void;
  placeholder?: string;
  invalid?: boolean;
  className?: string;
  arabic?: boolean;
};

export function ProviderCommuneSelect({
  providerWilayaId,
  value,
  onChange,
  placeholder = "Commune",
  invalid,
  className,
  arabic = false,
}: ProviderCommuneSelectProps) {
  const { data: providerCommunes = [] } = useProviderCommunes(providerWilayaId);
  const nameById = React.useMemo(
    () => new Map(
      providerCommunes.map((commune) => [
        String(commune.id),
        arabic ? commune.name_ar ?? commune.name : commune.name,
      ]),
    ),
    [providerCommunes, arabic],
  );

  return (
    <Select
      value={value !== null ? String(value) : null}
      onValueChange={(next) => {
        if (next === null) return
        onChange(Number(next))
      }}
      disabled={providerWilayaId === null}
    >
      <SelectTrigger
        aria-labelledby="provider_commune_label"
        dir={arabic ? "rtl" : "ltr"}
        className={cn("h-12 w-full text-base", className)}
        aria-invalid={invalid}
      >
        <SelectValue placeholder={placeholder}>
          {(selected: string | null) =>
            selected ? (nameById.get(selected) ?? selected) : placeholder
          }
        </SelectValue>
      </SelectTrigger>
      <SelectContent
        dir={arabic ? "rtl" : "ltr"}
        className="max-h-[65dvh] touch-pan-y overscroll-contain"
        align="start"
      >
        {providerCommunes.map((commune) => (
          <SelectItem
            key={commune.id}
            value={String(commune.id)}
            className="min-h-12 py-3 text-base"
          >
            {arabic ? commune.name_ar ?? commune.name : commune.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
