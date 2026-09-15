"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { format } from "date-fns"

import { transferBetweenWallets } from "@/features/wallets/api/wallet-api"
import {
  createTransferSchema,
  type CreateTransferSchema,
} from "@/features/wallets/schemas/create-transfer-schema"
import { getErrorMessage } from "@/lib/api"

const defaultValues: CreateTransferSchema = {
  date: new Date(),
  from_wallet_id: null,
  to_wallet_id: null,
  amount: "",
  remark: "",
}

export function useTransferWallets(onSuccess?: () => void) {
  const queryClient = useQueryClient()

  const form = useForm<CreateTransferSchema>({
    resolver: zodResolver(createTransferSchema),
    defaultValues,
  })

  const mutation = useMutation({
    mutationFn: (values: CreateTransferSchema) =>
      transferBetweenWallets({
        date: format(values.date, "yyyy-MM-dd"),
        from_wallet_id: values.from_wallet_id as number,
        to_wallet_id: values.to_wallet_id as number,
        amount: Number(values.amount),
        remark: values.remark || undefined,
      }),
    onSuccess: () => {
      toast.success("Transfert effectué.")
      queryClient.invalidateQueries({ queryKey: ["wallets"] })
      queryClient.invalidateQueries({ queryKey: ["wallet-stats"] })
      form.reset({ ...defaultValues, date: new Date() })
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
