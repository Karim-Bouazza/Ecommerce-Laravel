"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { getSiteLanguage, updateSiteLanguage } from "@/features/site-settings/api/language-api"
import type { SiteLanguage } from "@/features/site-settings/types"
import { getErrorMessage } from "@/lib/api"

const queryKey = ["site-settings", "language"]

export function LanguagePage() {
  const queryClient = useQueryClient()
  const { data, isLoading } = useQuery({ queryKey, queryFn: getSiteLanguage })
  const mutation = useMutation({
    mutationFn: updateSiteLanguage,
    onSuccess: (setting) => {
      queryClient.setQueryData(queryKey, setting)
      toast.success("Langue du site mise à jour.")
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  })

  if (isLoading || !data) return <Skeleton className="h-52 w-full max-w-xl" />

  return (
    <Card className="max-w-xl">
      <CardHeader>
        <CardTitle>Langue du site</CardTitle>
        <CardDescription>Choisissez la langue principale affichée sur la boutique en ligne.</CardDescription>
      </CardHeader>
      <CardContent>
        <label htmlFor="site-language" className="mb-2 block text-sm font-medium">Langue</label>
        <select
          id="site-language"
          value={data.language}
          disabled={mutation.isPending}
          onChange={(event) => mutation.mutate(event.target.value as SiteLanguage)}
          className="h-10 w-full max-w-sm rounded-md border bg-background px-3 text-sm"
        >
          <option value="fr">Français</option>
          <option value="ar">العربية</option>
        </select>
      </CardContent>
    </Card>
  )
}
