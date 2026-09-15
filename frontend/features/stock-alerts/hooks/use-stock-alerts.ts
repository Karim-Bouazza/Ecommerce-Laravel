"use client"

import { keepPreviousData, useQuery } from "@tanstack/react-query"

import { getStockAlerts, type GetStockAlertsParams } from "@/features/stock-alerts/api/stock-alert-api"

export function useStockAlerts(params: GetStockAlertsParams) {
  return useQuery({
    queryKey: ["stock-alerts", params],
    queryFn: () => getStockAlerts(params),
    enabled: params.warehouse_id !== undefined,
    placeholderData: keepPreviousData,
  })
}
