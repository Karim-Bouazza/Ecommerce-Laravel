"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"

import { updateProduct } from "@/features/products/api/product-api"
import {
  productUpdateSchema,
  type ProductUpdateFormInput,
  type ProductUpdateFormOutput,
} from "@/features/products/schemas/product-schema"
import type { Product } from "@/features/products/types"
import { getErrorMessage } from "@/lib/api"

export function useUpdateProduct(product: Product, onSuccess?: () => void) {
  const queryClient = useQueryClient()

  const form = useForm<ProductUpdateFormInput, unknown, ProductUpdateFormOutput>({
    resolver: zodResolver(productUpdateSchema),
    defaultValues: {
      name: product.name,
      description: product.description,
      category_id: product.category_id,
      purchase_price: product.purchase_price,
      price: product.price,
      is_active: product.is_active,
      image: null,
    },
  })

  const mutation = useMutation({
    mutationFn: (values: ProductUpdateFormOutput) => updateProduct(product.id, values),
    onSuccess: () => {
      toast.success("Produit modifié.")
      queryClient.invalidateQueries({ queryKey: ["products"] })
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
