"use client"

import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import {
  completeMetaCallback,
  disconnectMeta,
  getMetaAuthUrl,
  getMetaConnection,
  getMetaSpend,
  linkMetaCampaign,
  saveMetaApp,
  selectMetaAdAccount,
  testMetaConnection,
} from "@/features/meta-ads/api/meta-ads-api"
import type { MetaDateRange } from "@/features/meta-ads/types"
import { getErrorMessage } from "@/lib/api"

const CONNECTION_KEY = ["meta-ads", "connection"] as const

export function useMetaConnection() {
  return useQuery({ queryKey: CONNECTION_KEY, queryFn: getMetaConnection })
}

export function useMetaSpend(range: MetaDateRange, enabled = true) {
  return useQuery({
    queryKey: ["meta-ads", "spend", range],
    queryFn: () => getMetaSpend(range),
    enabled,
    placeholderData: keepPreviousData,
    retry: false,
  })
}

export function useRefreshMetaSpend(range: MetaDateRange) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => getMetaSpend(range, true),
    onSuccess: (data) => {
      queryClient.setQueryData(["meta-ads", "spend", range], data)
      toast.success("Données actualisées.")
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  })
}

export function useSaveMetaApp() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: saveMetaApp,
    onSuccess: (data) => {
      queryClient.setQueryData(CONNECTION_KEY, data)
      toast.success("Application Meta enregistrée.")
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  })
}

export function useStartMetaOAuth() {
  return useMutation({
    mutationFn: async () => {
      const redirectUri = `${window.location.origin}/admin/adpilot/publicite/callback`
      return getMetaAuthUrl(redirectUri)
    },
    onSuccess: (url) => {
      window.location.href = url
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  })
}

export function useCompleteMetaCallback() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: completeMetaCallback,
    onSuccess: (data) => {
      queryClient.setQueryData(CONNECTION_KEY, data)
      queryClient.invalidateQueries({ queryKey: ["meta-ads", "spend"] })
    },
  })
}

export function useSelectMetaAdAccount() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: selectMetaAdAccount,
    onSuccess: (data) => {
      queryClient.setQueryData(CONNECTION_KEY, data)
      queryClient.invalidateQueries({ queryKey: ["meta-ads", "spend"] })
      toast.success("Compte publicitaire mis à jour.")
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  })
}

export function useTestMetaConnection() {
  return useMutation({
    mutationFn: testMetaConnection,
    onSuccess: (data) => toast.success(`Connexion valide${data.name ? ` (${data.name})` : ""}.`),
    onError: (error) => toast.error(getErrorMessage(error)),
  })
}

export function useDisconnectMeta() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: disconnectMeta,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["meta-ads"] })
      queryClient.invalidateQueries({ queryKey: ["product-analytics"] })
      toast.success("Compte Meta déconnecté.")
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  })
}

export function useLinkMetaCampaign() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (vars: { id: string; name: string; product_id: number | null }) =>
      linkMetaCampaign(vars.id, { name: vars.name, product_id: vars.product_id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["meta-ads", "spend"] })
      queryClient.invalidateQueries({ queryKey: ["product-analytics"] })
      toast.success("Campagne associée.")
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  })
}
