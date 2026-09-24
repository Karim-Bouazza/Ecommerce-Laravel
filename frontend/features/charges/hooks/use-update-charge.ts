"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { format } from "date-fns"

import { updateCharge } from "@/features/charges/api/charge-api"
import { chargeSchema, type ChargeSchema } from "@/features/charges/schemas/charge-schema"
import type { Charge } from "@/features/charges/types"
import { getErrorMessage } from "@/lib/api"

function parseDateOnly(value: string | null): Date | null {
  if (!value) return null
  const [year, month, day] = value.split("-").map(Number)
  return new Date(year, month - 1, day)
}

export function buildChargeDefaultValues(charge: Charge): ChargeSchema {
  return {
    category: charge.category,
    type: charge.type,
    order_trigger: charge.order_trigger,
    recurrence_frequency: charge.recurrence_frequency,
    name: charge.name,
    amount: String(charge.amount),
    starts_at: parseDateOnly(charge.starts_at),
    ends_at: parseDateOnly(charge.ends_at),
    all_products: charge.all_products,
    product_ids: charge.product_ids,
  }
}

export function useUpdateCharge(charge: Charge, onSuccess?: () => void) {
  const queryClient = useQueryClient()

  const form = useForm<ChargeSchema>({
    resolver: zodResolver(chargeSchema),
    defaultValues: buildChargeDefaultValues(charge),
  })

  const mutation = useMutation({
    mutationFn: (values: ChargeSchema) =>
      updateCharge(charge.id, {
        category: values.category,
        type: values.type,
        order_trigger: values.type === "per_order" ? values.order_trigger : null,
        recurrence_frequency: values.type === "recurring" ? values.recurrence_frequency : null,
        name: values.name,
        amount: Number(values.amount),
        starts_at:
          values.type !== "recurring" && values.starts_at
            ? format(values.starts_at, "yyyy-MM-dd")
            : undefined,
        ends_at:
          values.type !== "recurring" && values.ends_at
            ? format(values.ends_at, "yyyy-MM-dd")
            : undefined,
        all_products: values.all_products,
        product_ids: values.all_products ? [] : values.product_ids,
      }),
    onSuccess: () => {
      toast.success("Charge modifiée.")
      queryClient.invalidateQueries({ queryKey: ["charges"] })
      onSuccess?.()
    },
    onError: (error) => {
      toast.error(getErrorMessage(error))
    },
  })

  const onSubmit = form.handleSubmit((values) => {
    mutation.mutate(values)
  })

  return {
    form,
    onSubmit,
    isSubmitting: mutation.isPending,
  }
}
