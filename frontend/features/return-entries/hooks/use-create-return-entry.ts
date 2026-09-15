"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"

import { createReturnEntry } from "@/features/return-entries/api/return-entry-api"
import {
  returnEntrySchema,
  type ReturnEntrySchema,
} from "@/features/return-entries/schemas/return-entry-schema"
import { getErrorMessage } from "@/lib/api"

export function useCreateReturnEntry(onSuccess?: () => void) {
  const queryClient = useQueryClient()

  const form = useForm<ReturnEntrySchema>({
    resolver: zodResolver(returnEntrySchema),
    defaultValues: {
      purchase_entry_id: 0,
      remark: "",
      items: [],
    },
  })

  const mutation = useMutation({
    mutationFn: createReturnEntry,
    onSuccess: () => {
      toast.success("Entrée de retour créée.")
      queryClient.invalidateQueries({ queryKey: ["return-entries"] })
      form.reset({ purchase_entry_id: 0, remark: "", items: [] })
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
