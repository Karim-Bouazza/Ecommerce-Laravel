"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"

import { updateRole } from "@/features/roles/api/role-api"
import { roleSchema, type RoleSchema } from "@/features/roles/schemas/role-schema"
import { getErrorMessage } from "@/lib/api"

export function useUpdateRole(roleId: number, onSuccess?: () => void) {
  const queryClient = useQueryClient()

  const form = useForm<RoleSchema>({
    resolver: zodResolver(roleSchema),
    defaultValues: {
      name: "",
      permissions: [],
    },
  })

  const mutation = useMutation({
    mutationFn: (values: RoleSchema) => updateRole(roleId, values),
    onSuccess: () => {
      toast.success("Rôle modifié.")
      queryClient.invalidateQueries({ queryKey: ["roles"] })
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
