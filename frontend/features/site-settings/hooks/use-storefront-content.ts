"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import {
  addSectionProduct,
  createFeature,
  createPromoBanner,
  deleteFeature,
  deletePromoBanner,
  type FeaturePayload,
  getSectionProducts,
  getStorefrontFeatures,
  getStorefrontPromoBanners,
  type PromoBannerPayload,
  removeSectionProduct,
  reorderFeatures,
  reorderPromoBanners,
  reorderSectionProducts,
  updateFeature,
  updatePromoBanner,
  updateSectionProductLabel,
} from "@/features/site-settings/api/storefront-content-api"
import type { StorefrontSection } from "@/features/site-settings/types"
import { getErrorMessage } from "@/lib/api"

const sectionKey = (section: StorefrontSection) => ["site-settings", "sections", section]
const FEATURES_KEY = ["site-settings", "features"]
const PROMO_BANNERS_KEY = ["site-settings", "promo-banners"]

function useContentMutation<TVariables, TResult>(
  queryKey: unknown[],
  mutationFn: (variables: TVariables) => Promise<TResult>,
  successMessage?: string
) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn,
    onSuccess: () => {
      if (successMessage) toast.success(successMessage)
      queryClient.invalidateQueries({ queryKey })
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  })
}

/* ---------- Section products ---------- */

export function useSectionProducts(section: StorefrontSection) {
  return useQuery({ queryKey: sectionKey(section), queryFn: () => getSectionProducts(section) })
}

export function useAddSectionProduct(section: StorefrontSection) {
  return useContentMutation(
    sectionKey(section),
    (payload: { product_id: number; label: string | null }) => addSectionProduct(section, payload),
    "Produit ajouté à la section."
  )
}

export function useUpdateSectionProductLabel(section: StorefrontSection) {
  return useContentMutation(
    sectionKey(section),
    ({ id, label }: { id: number; label: string | null }) => updateSectionProductLabel(section, id, label),
    "Texte mis à jour."
  )
}

export function useReorderSectionProducts(section: StorefrontSection) {
  return useContentMutation(sectionKey(section), (ids: number[]) => reorderSectionProducts(section, ids))
}

export function useRemoveSectionProduct(section: StorefrontSection) {
  return useContentMutation(
    sectionKey(section),
    (id: number) => removeSectionProduct(section, id),
    "Produit retiré de la section."
  )
}

/* ---------- Nos Atouts ---------- */

export function useStorefrontFeatures() {
  return useQuery({ queryKey: FEATURES_KEY, queryFn: getStorefrontFeatures })
}

export function useSaveFeature() {
  return useContentMutation(
    FEATURES_KEY,
    ({ id, ...payload }: FeaturePayload & { id?: number }) =>
      id ? updateFeature(id, payload) : createFeature(payload),
    "Atout enregistré."
  )
}

export function useReorderFeatures() {
  return useContentMutation(FEATURES_KEY, reorderFeatures)
}

export function useDeleteFeature() {
  return useContentMutation(FEATURES_KEY, deleteFeature, "Atout supprimé.")
}

/* ---------- Bannières promotionnelles ---------- */

export function useStorefrontPromoBanners() {
  return useQuery({ queryKey: PROMO_BANNERS_KEY, queryFn: getStorefrontPromoBanners })
}

export function useSavePromoBanner() {
  return useContentMutation(
    PROMO_BANNERS_KEY,
    ({ id, ...payload }: PromoBannerPayload & { id?: number }) =>
      id ? updatePromoBanner(id, payload) : createPromoBanner(payload),
    "Bannière enregistrée."
  )
}

export function useReorderPromoBanners() {
  return useContentMutation(PROMO_BANNERS_KEY, reorderPromoBanners)
}

export function useDeletePromoBanner() {
  return useContentMutation(PROMO_BANNERS_KEY, deletePromoBanner, "Bannière supprimée.")
}
