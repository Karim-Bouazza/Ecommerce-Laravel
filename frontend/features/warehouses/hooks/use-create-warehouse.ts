"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"

import { createWarehouse } from "@/features/warehouses/api/warehouse-api"
import {
  warehouseSchema,
  type WarehouseSchema,
} from "@/features/warehouses/schemas/warehouse-schema"
import { getErrorMessage } from "@/lib/api"

export function useCreateWarehouse(onSuccess?: () => void) {
  const queryClient = useQueryClient()

  const form = useForm<WarehouseSchema>({
    resolver: zodResolver(warehouseSchema),
    defaultValues: {
      name: "",
      phone: "",
      remark: "",
      address: "",
      all_wilayas: false,
      all_products: false,
      wilaya_ids: [],
      product_ids: [],
    },
  })

  const mutation = useMutation({
    mutationFn: createWarehouse,
    onSuccess: () => {
      toast.success("Entrepôt créé.")
      queryClient.invalidateQueries({ queryKey: ["warehouses"] })
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
