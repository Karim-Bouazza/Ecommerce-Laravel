"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { deleteOrder } from "@/features/orders/api/order-api"
import { getErrorMessage } from "@/lib/api"

export function useDeleteOrder(onSuccess?: () => void) {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: (id: number) => deleteOrder(id),
    onSuccess: () => {
      toast.success("Commande supprimée.")
      queryClient.invalidateQueries({ queryKey: ["orders"] })
      onSuccess?.()
    },
    onError: (error) => {
      toast.error(getErrorMessage(error))
    },
  })

  return mutation
}
