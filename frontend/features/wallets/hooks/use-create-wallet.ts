"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"

import { createWallet } from "@/features/wallets/api/wallet-api"
import {
  createWalletSchema,
  type CreateWalletSchema,
} from "@/features/wallets/schemas/create-wallet-schema"
import { getErrorMessage } from "@/lib/api"

export function useCreateWallet(onSuccess?: () => void) {
  const queryClient = useQueryClient()

  const form = useForm<CreateWalletSchema>({
    resolver: zodResolver(createWalletSchema),
    defaultValues: { name: "", remark: "" },
  })

  const mutation = useMutation({
    mutationFn: createWallet,
    onSuccess: () => {
      toast.success("Portefeuille créé.")
      queryClient.invalidateQueries({ queryKey: ["wallets"] })
      queryClient.invalidateQueries({ queryKey: ["wallet-stats"] })
      form.reset()
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
