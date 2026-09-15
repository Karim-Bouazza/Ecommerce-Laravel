"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"

import { updateSupplier } from "@/features/suppliers/api/supplier-api"
import {
  supplierSchema,
  type SupplierSchema,
} from "@/features/suppliers/schemas/supplier-schema"
import type { Supplier } from "@/features/suppliers/types"
import { getErrorMessage } from "@/lib/api"

export function useUpdateSupplier(supplier: Supplier, onSuccess?: () => void) {
  const queryClient = useQueryClient()

  const form = useForm<SupplierSchema>({
    resolver: zodResolver(supplierSchema),
    defaultValues: {
      name: supplier.name,
      phone: supplier.phone ?? "",
      remark: supplier.remark ?? "",
      address: supplier.address ?? "",
    },
  })

  const mutation = useMutation({
    mutationFn: (values: SupplierSchema) => updateSupplier(supplier.id, values),
    onSuccess: () => {
      toast.success("Fournisseur modifié.")
      queryClient.invalidateQueries({ queryKey: ["suppliers"] })
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
