"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"

import { updateWarehouse } from "@/features/warehouses/api/warehouse-api"
import {
  warehouseSchema,
  type WarehouseSchema,
} from "@/features/warehouses/schemas/warehouse-schema"
import type { Warehouse } from "@/features/warehouses/types"
import { getErrorMessage } from "@/lib/api"

export function useUpdateWarehouse(warehouse: Warehouse, onSuccess?: () => void) {
  const queryClient = useQueryClient()

  const form = useForm<WarehouseSchema>({
    resolver: zodResolver(warehouseSchema),
    defaultValues: {
      name: warehouse.name,
      phone: warehouse.phone ?? "",
      remark: warehouse.remark ?? "",
      address: warehouse.address ?? "",
      all_wilayas: warehouse.all_wilayas,
      all_products: warehouse.all_products,
      wilaya_ids: warehouse.wilaya_ids,
      product_ids: warehouse.product_ids,
    },
  })

  const mutation = useMutation({
    mutationFn: (values: WarehouseSchema) => updateWarehouse(warehouse.id, values),
    onSuccess: () => {
      toast.success("Entrepôt modifié.")
      queryClient.invalidateQueries({ queryKey: ["warehouses"] })
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
