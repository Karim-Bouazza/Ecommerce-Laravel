"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"

import { createRole } from "@/features/roles/api/role-api"
import { roleSchema, type RoleSchema } from "@/features/roles/schemas/role-schema"
import { getErrorMessage } from "@/lib/api"

export function useCreateRole(onSuccess?: () => void) {
  const queryClient = useQueryClient()

  const form = useForm<RoleSchema>({
    resolver: zodResolver(roleSchema),
    defaultValues: {
      name: "",
      permissions: [],
    },
  })

  const mutation = useMutation({
    mutationFn: createRole,
    onSuccess: () => {
      toast.success("Rôle créé.")
      queryClient.invalidateQueries({ queryKey: ["roles"] })
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
