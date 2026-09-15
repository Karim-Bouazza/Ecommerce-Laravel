"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { format } from "date-fns"

import { withdrawFromWallet } from "@/features/wallets/api/wallet-api"
import {
  walletWithdrawalSchema,
  type WalletWithdrawalSchema,
} from "@/features/wallets/schemas/wallet-withdrawal-schema"
import { getErrorMessage } from "@/lib/api"

const defaultValues: WalletWithdrawalSchema = {
  date: new Date(),
  amount: "",
  remark: "",
}

export function useWithdrawFromWallet(walletId: number, onSuccess?: () => void) {
  const queryClient = useQueryClient()

  const form = useForm<WalletWithdrawalSchema>({
    resolver: zodResolver(walletWithdrawalSchema),
    defaultValues,
  })

  const mutation = useMutation({
    mutationFn: (values: WalletWithdrawalSchema) =>
      withdrawFromWallet(walletId, {
        date: format(values.date, "yyyy-MM-dd"),
        amount: Number(values.amount),
        remark: values.remark || undefined,
      }),
    onSuccess: () => {
      toast.success("Sortie enregistrée.")
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
