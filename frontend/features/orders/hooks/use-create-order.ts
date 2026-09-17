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
      provider_wilaya_id: null,
      provider_commune_id: null,
      delivery_type: "express",
      provider_office_id: null,
      delivery_price: 0,
      delivery_note: "",
      name: "",
      provider_order_id: "",
      free_delivery: false,
      can_be_opened: false,
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
      commune_id: values.commune_id,
      address: values.address || undefined,
      provider_wilaya_id: values.provider_wilaya_id,
      provider_commune_id: values.provider_commune_id,
      delivery_type: values.delivery_type,
      provider_office_id: values.provider_office_id,
      delivery_price: values.delivery_price,
      delivery_note: values.delivery_note || undefined,
      name: values.name || undefined,
      provider_order_id: values.provider_order_id || undefined,
      free_delivery: values.free_delivery,
      can_be_opened: values.can_be_opened,
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
