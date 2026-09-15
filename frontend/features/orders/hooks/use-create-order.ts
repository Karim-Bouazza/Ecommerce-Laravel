"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"

import { createManualOrder } from "@/features/orders/api/order-api"
import { createOrderSchema, type CreateOrderSchema } from "@/features/orders/schemas/order-schema"
import { getErrorMessage } from "@/lib/api"

export function useCreateOrder(onSuccess?: () => void) {
  const queryClient = useQueryClient()

  const form = useForm<CreateOrderSchema>({
    resolver: zodResolver(createOrderSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      phone_number: "",
      wilaya_id: null,
      commune_id: null,
      address: "",
      delivery_type: "domicile",
      stop_desk_company_id: null,
      delivery_price: 0,
      delivery_note: "",
      items: [{ warehouse_id: 0, product_id: 0, variant: "", quantity: 1, unit_price: undefined }],
    },
  })

  const mutation = useMutation({
    mutationFn: createManualOrder,
    onSuccess: () => {
      toast.success("Commande créée.")
      queryClient.invalidateQueries({ queryKey: ["orders"] })
      form.reset()
      onSuccess?.()
    },
    onError: (error) => {
      toast.error(getErrorMessage(error))
    },
  })

  const onSubmit = form.handleSubmit((values) => {
    mutation.mutate({
      first_name: values.first_name,
      last_name: values.last_name,
      phone_number: values.phone_number,
      wilaya_id: values.wilaya_id as number,
      commune_id: values.commune_id as number,
      address: values.address || undefined,
      delivery_type: values.delivery_type,
      stop_desk_company_id: values.stop_desk_company_id ?? undefined,
      delivery_price: values.delivery_price,
      delivery_note: values.delivery_note || undefined,
      items: values.items.map((item) => ({
        warehouse_id: item.warehouse_id,
        product_id: item.product_id,
        variant: item.variant || undefined,
        quantity: item.quantity,
        unit_price: item.unit_price,
      })),
    })
  })

  return {
    form,
    onSubmit,
    isSubmitting: mutation.isPending,
  }
}
