"use client"

import { useQuery } from "@tanstack/react-query"

import { getPermissionsCatalogue } from "@/features/roles/api/role-api"

export function usePermissionsCatalogue(enabled = true) {
  return useQuery({
    queryKey: ["roles", "permissions-catalogue"],
    queryFn: getPermissionsCatalogue,
    enabled,
  })
}
