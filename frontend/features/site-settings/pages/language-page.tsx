"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Check, Languages } from "lucide-react"
import { toast } from "sonner"
import { cn } from "cn"

import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { getSiteLanguage, updateSiteLanguage } from "@/features/site-settings/api/language-api"
import { SettingsPageShell } from "@/features/site-settings/components/settings-page-shell"
import type { SiteLanguage } from "@/features/site-settings/types"
import { getErrorMessage } from "@/lib/api"

const queryKey = ["site-settings", "language"]

const LANGUAGES: { value: SiteLanguage; label: string; native: string; hint: string }[] = [
  { value: "fr", label: "Français", native: "FR", hint: "Lecture de gauche à droite" },
  { value: "ar", label: "العربية", native: "AR", hint: "Lecture de droite à gauche" },
]

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

  return (
    <SettingsPageShell
      icon={Languages}
      title="Langue du site"
      description="Choisissez la langue principale affichée sur la boutique en ligne. Le changement est appliqué immédiatement."
      className="max-w-3xl"
    >
      {isLoading || !data ? (
        <Skeleton className="h-36 w-full" />
      ) : (
        <Card>
          <CardContent>
            <div role="radiogroup" aria-label="Langue du site" className="grid gap-3 sm:grid-cols-2">
              {LANGUAGES.map((language) => {
                const selected = data.language === language.value

                return (
                  <button
                    key={language.value}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    disabled={mutation.isPending}
                    onClick={() => !selected && mutation.mutate(language.value)}
                    className={cn(
                      "flex min-h-16 cursor-pointer items-center gap-4 rounded-xl border p-4 text-left transition-colors focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-wait disabled:opacity-60",
                      selected
                        ? "border-primary bg-primary/5"
                        : "border-border hover:bg-muted/60"
                    )}
                  >
                    <span
                      className={cn(
                        "flex size-10 shrink-0 items-center justify-center rounded-lg text-sm font-semibold",
                        selected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                      )}
                    >
                      {language.native}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-base font-medium text-foreground">
                        {language.label}
                      </span>
                      <span className="block text-xs text-muted-foreground">{language.hint}</span>
                    </span>
                    {selected && <Check aria-hidden="true" className="size-5 shrink-0 text-primary" />}
                  </button>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </SettingsPageShell>
  )
}
