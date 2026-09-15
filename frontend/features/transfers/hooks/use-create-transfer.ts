"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"

import { createTransfer } from "@/features/transfers/api/transfer-api"
import { transferSchema, type TransferSchema } from "@/features/transfers/schemas/transfer-schema"
import { getErrorMessage } from "@/lib/api"

export function useCreateTransfer(onSuccess?: () => void) {
  const queryClient = useQueryClient()

  const form = useForm<TransferSchema>({
    resolver: zodResolver(transferSchema),
    defaultValues: {
      from_warehouse_id: 0,
      to_warehouse_id: 0,
      remark: "",
      items: [{ product_id: 0, quantity: 1 }],
    },
  })

  const mutation = useMutation({
    mutationFn: createTransfer,
    onSuccess: () => {
      toast.success("Transfert créé.")
      queryClient.invalidateQueries({ queryKey: ["transfers"] })
      form.reset()
      onSuccess?.()
    },
    onError: (error) => {
      toast.error(getErrorMessage(error))
    },
  })

  const onSubmit = form.handleSubmit((values) => {
    mutation.mutate({
      from_warehouse_id: values.from_warehouse_id,
      to_warehouse_id: values.to_warehouse_id,
      remark: values.remark || undefined,
      items: values.items,
    })
  })

  return {
    form,
    onSubmit,
    isSubmitting: mutation.isPending,
  }
}
