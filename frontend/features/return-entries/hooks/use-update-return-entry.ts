"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"

import { updateReturnEntry } from "@/features/return-entries/api/return-entry-api"
import {
  returnEntrySchema,
  type ReturnEntrySchema,
} from "@/features/return-entries/schemas/return-entry-schema"
import type { ReturnEntry } from "@/features/return-entries/types"
import { getErrorMessage } from "@/lib/api"

export function returnEntryToFormValues(entry: ReturnEntry): ReturnEntrySchema {
  return {
    purchase_entry_id: entry.purchase_entry.id,
    remark: entry.remark ?? "",
    items: entry.items.map((item) => ({
      purchase_entry_item_id: item.purchase_entry_item_id,
      quantity: item.quantity,
    })),
  }
}

export function useUpdateReturnEntry(entry: ReturnEntry, onSuccess?: () => void) {
  const queryClient = useQueryClient()

  const form = useForm<ReturnEntrySchema>({
    resolver: zodResolver(returnEntrySchema),
    defaultValues: returnEntryToFormValues(entry),
  })

  const mutation = useMutation({
    mutationFn: (values: ReturnEntrySchema) =>
      updateReturnEntry(entry.id, { remark: values.remark, items: values.items }),
    onSuccess: () => {
      toast.success("Entrée de retour modifiée.")
      queryClient.invalidateQueries({ queryKey: ["return-entries"] })
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
