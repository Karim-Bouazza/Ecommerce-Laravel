"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"

import { updateBrand } from "@/features/brands/api/brand-api"
import { brandSchema, type BrandSchema } from "@/features/brands/schemas/brand-schema"
import type { Brand } from "@/features/brands/types"
import { getErrorMessage } from "@/lib/api"

export function useUpdateBrand(brand: Brand, onSuccess?: () => void) {
  const queryClient = useQueryClient()

  const form = useForm<BrandSchema>({
    resolver: zodResolver(brandSchema),
    defaultValues: {
      name: brand.name,
      is_active: brand.is_active,
    },
  })

  const mutation = useMutation({
    mutationFn: (values: BrandSchema) => updateBrand(brand.id, values),
    onSuccess: () => {
      toast.success("Marque modifiée.")
      queryClient.invalidateQueries({ queryKey: ["brands"] })
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
