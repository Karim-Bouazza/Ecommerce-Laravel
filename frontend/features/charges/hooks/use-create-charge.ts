"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { format } from "date-fns"

import { createCharge } from "@/features/charges/api/charge-api"
import { chargeSchema, type ChargeSchema } from "@/features/charges/schemas/charge-schema"
import { getErrorMessage } from "@/lib/api"

function buildDefaultValues(category: string): ChargeSchema {
  return {
    category,
    type: "normal",
    order_trigger: null,
    recurrence_frequency: null,
    name: "",
    amount: "",
    starts_at: null,
    ends_at: null,
    all_products: false,
    product_ids: [],
  }
}

export function useCreateCharge(category: string, onSuccess?: () => void) {
  const queryClient = useQueryClient()

  const form = useForm<ChargeSchema>({
    resolver: zodResolver(chargeSchema),
    defaultValues: buildDefaultValues(category),
  })

  const mutation = useMutation({
    mutationFn: (values: ChargeSchema) =>
      createCharge({
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
      toast.success("Charge créée.")
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
