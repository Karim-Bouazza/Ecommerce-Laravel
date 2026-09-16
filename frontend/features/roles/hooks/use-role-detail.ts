"use client"

import { useQuery } from "@tanstack/react-query"

import { getRoleDetail } from "@/features/roles/api/role-api"

export function useRoleDetail(roleId: number | null) {
  return useQuery({
    queryKey: ["roles", roleId, "detail"],
    queryFn: () => getRoleDetail(roleId as number),
    enabled: roleId !== null,
  })
}
