"use client"

import { keepPreviousData, useQuery } from "@tanstack/react-query"

import { getRoles, type GetRolesParams } from "@/features/roles/api/role-api"

export function useRoles(params: GetRolesParams) {
  return useQuery({
    queryKey: ["roles", params],
    queryFn: () => getRoles(params),
    placeholderData: keepPreviousData,
  })
}
