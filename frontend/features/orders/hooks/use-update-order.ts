"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"

import { updateManualOrder } from "@/features/orders/api/order-api"
import { createOrderSchema, type CreateOrderSchema } from "@/features/orders/schemas/order-schema"
import type { Order } from "@/features/orders/types"
import { getErrorMessage } from "@/lib/api"

export function buildOrderFormDefaults(order: Order): CreateOrderSchema {
  return {
    first_name: order.first_name ?? "",
    last_name: order.last_name ?? "",
    phone_number: order.phone_number ?? "",
    wilaya_id: order.wilaya_id,
    commune_id: order.commune_id,
    address: order.address ?? "",
    provider_wilaya_id: order.provider_wilaya_id,
    provider_commune_id: order.provider_commune_id,
    delivery_type: order.delivery_type === "point_relais" ? "point_relais" : "express",
    stop_desk_company_id: order.stop_desk_company_id,
    delivery_price: order.delivery_price,
    delivery_note: order.delivery_note ?? "",
    name: order.name ?? "",
    provider_order_id: order.provider_order_id ?? "",
    free_delivery: order.free_delivery,
    can_be_opened: order.can_be_opened,
    items: order.items.map((item) => ({
      id: item.id,
      warehouse_id: item.warehouse_id ?? 0,
      product_id: item.product_id,
      variant: item.variant ?? "",
      quantity: item.quantity,
      unit_price: item.price,
    })),
  }
}

export function useUpdateOrder(order: Order, onSuccess?: () => void) {
  const queryClient = useQueryClient()

  const form = useForm<CreateOrderSchema>({
    resolver: zodResolver(createOrderSchema),
    defaultValues: buildOrderFormDefaults(order),
  })

  const mutation = useMutation({
    mutationFn: (values: CreateOrderSchema) =>
      updateManualOrder(order.id, {
        first_name: values.first_name,
        last_name: values.last_name,
        phone_number: values.phone_number,
        wilaya_id: values.wilaya_id as number,
        commune_id: values.commune_id,
        address: values.address || undefined,
        provider_wilaya_id: values.provider_wilaya_id,
        provider_commune_id: values.provider_commune_id,
        delivery_type: values.delivery_type,
        stop_desk_company_id: values.stop_desk_company_id ?? undefined,
        delivery_price: values.delivery_price,
        delivery_note: values.delivery_note || undefined,
        name: values.name || undefined,
        provider_order_id: values.provider_order_id || undefined,
        free_delivery: values.free_delivery,
        can_be_opened: values.can_be_opened,
        items: values.items.map((item) => ({
          id: item.id,
          warehouse_id: item.warehouse_id,
          product_id: item.product_id,
          variant: item.variant || undefined,
          quantity: item.quantity,
          unit_price: item.unit_price,
        })),
      }),
    onSuccess: () => {
      toast.success("Commande mise à jour.")
      queryClient.invalidateQueries({ queryKey: ["orders"] })
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
