"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"

import { updateClient } from "@/features/clients/api/client-api"
import {
  updateClientSchema,
  type UpdateClientSchema,
} from "@/features/clients/schemas/update-client-schema"
import type { Client } from "@/features/clients/types"
import { getErrorMessage } from "@/lib/api"

export function useUpdateClient(client: Client, onSuccess?: () => void) {
  const queryClient = useQueryClient()

  const form = useForm<UpdateClientSchema>({
    resolver: zodResolver(updateClientSchema),
    defaultValues: {
      first_name: client.first_name,
      last_name: client.last_name,
      phone_number: client.phone_number,
      wilaya_id: client.wilaya_id,
      commune_id: client.commune_id,
    },
  })

  const mutation = useMutation({
    mutationFn: (values: UpdateClientSchema) => updateClient(client.id, values),
    onSuccess: () => {
      toast.success("Client modifié.")
      queryClient.invalidateQueries({ queryKey: ["clients"] })
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
