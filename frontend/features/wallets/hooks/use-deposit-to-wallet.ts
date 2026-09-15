"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { format } from "date-fns"

import { depositToWallet } from "@/features/wallets/api/wallet-api"
import {
  walletDepositSchema,
  type WalletDepositSchema,
} from "@/features/wallets/schemas/wallet-deposit-schema"
import { getErrorMessage } from "@/lib/api"

const defaultValues: WalletDepositSchema = {
  date: new Date(),
  amount: "",
  remark: "",
}

export function useDepositToWallet(walletId: number, onSuccess?: () => void) {
  const queryClient = useQueryClient()

  const form = useForm<WalletDepositSchema>({
    resolver: zodResolver(walletDepositSchema),
    defaultValues,
  })

  const mutation = useMutation({
    mutationFn: (values: WalletDepositSchema) =>
      depositToWallet(walletId, {
        date: format(values.date, "yyyy-MM-dd"),
        amount: Number(values.amount),
        remark: values.remark || undefined,
      }),
    onSuccess: () => {
      toast.success("Entrée enregistrée.")
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
