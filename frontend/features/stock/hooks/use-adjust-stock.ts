"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"

import { adjustStock } from "@/features/stock/api/stock-api"
import { adjustStockSchema, type AdjustStockSchema } from "@/features/stock/schemas/adjust-stock-schema"
import type { StockItem } from "@/features/stock/types"
import { getErrorMessage } from "@/lib/api"

export function useAdjustStock(product: StockItem, warehouseId: number, onSuccess?: () => void) {
  const queryClient = useQueryClient()

  const form = useForm<AdjustStockSchema>({
    resolver: zodResolver(adjustStockSchema),
    defaultValues: {
      adjustment: 0,
    },
  })

  const mutation = useMutation({
    mutationFn: (values: AdjustStockSchema) =>
      adjustStock(product.id, {
        warehouse_id: warehouseId,
        adjustment: values.adjustment,
      }),
    onSuccess: () => {
      toast.success("Stock mis à jour.")
      queryClient.invalidateQueries({ queryKey: ["stock"] })
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
