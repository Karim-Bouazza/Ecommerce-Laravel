"use client"

import { keepPreviousData, useQuery } from "@tanstack/react-query"

import { getDashboard, type GetDashboardParams } from "@/features/dashboard/api/dashboard-api"

export function useDashboard(params: GetDashboardParams) {
  return useQuery({
    queryKey: ["dashboard", params],
    queryFn: () => getDashboard(params),
    placeholderData: keepPreviousData,
  })
}
