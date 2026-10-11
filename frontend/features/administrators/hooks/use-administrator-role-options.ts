"use client"

import { useQuery } from "@tanstack/react-query"

import { getAdministratorRoleOptions } from "@/features/administrators/api/administrator-api"

export function useAdministratorRoleOptions(enabled = true) {
  return useQuery({
    queryKey: ["administrators", "role-options"],
    queryFn: getAdministratorRoleOptions,
    enabled,
    staleTime: 60_000,
  })
}
