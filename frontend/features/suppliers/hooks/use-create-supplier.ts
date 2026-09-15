"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"

import { createSupplier } from "@/features/suppliers/api/supplier-api"
import {
  supplierSchema,
  type SupplierSchema,
} from "@/features/suppliers/schemas/supplier-schema"
import { getErrorMessage } from "@/lib/api"

export function useCreateSupplier(onSuccess?: () => void) {
  const queryClient = useQueryClient()

  const form = useForm<SupplierSchema>({
    resolver: zodResolver(supplierSchema),
    defaultValues: {
      name: "",
      phone: "",
      remark: "",
      address: "",
    },
  })

  const mutation = useMutation({
    mutationFn: createSupplier,
    onSuccess: () => {
      toast.success("Fournisseur créé.")
      queryClient.invalidateQueries({ queryKey: ["suppliers"] })
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
