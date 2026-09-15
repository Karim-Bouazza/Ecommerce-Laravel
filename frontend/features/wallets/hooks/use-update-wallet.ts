"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"

import { updateWallet } from "@/features/wallets/api/wallet-api"
import {
  createWalletSchema,
  type CreateWalletSchema,
} from "@/features/wallets/schemas/create-wallet-schema"
import type { Wallet } from "@/features/wallets/types"
import { getErrorMessage } from "@/lib/api"

export function useUpdateWallet(wallet: Wallet, onSuccess?: () => void) {
  const queryClient = useQueryClient()

  const form = useForm<CreateWalletSchema>({
    resolver: zodResolver(createWalletSchema),
    defaultValues: { name: wallet.name, remark: wallet.remark ?? "" },
  })

  const mutation = useMutation({
    mutationFn: (values: CreateWalletSchema) => updateWallet(wallet.id, values),
    onSuccess: () => {
      toast.success("Portefeuille modifié.")
      queryClient.invalidateQueries({ queryKey: ["wallets"] })
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
