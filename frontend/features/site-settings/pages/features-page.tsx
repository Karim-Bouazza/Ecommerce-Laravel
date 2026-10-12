"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { Plus, Sparkles } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { Textarea } from "@/components/ui/textarea"
import { CapacityMeter } from "@/features/site-settings/components/capacity-meter"
import { ContentEmptyState } from "@/features/site-settings/components/content-empty-state"
import { ContentItemRow, moveId } from "@/features/site-settings/components/content-item-row"
import { ImageInput } from "@/features/site-settings/components/image-input"
import { SettingsPageShell } from "@/features/site-settings/components/settings-page-shell"
import {
  useDeleteFeature,
  useReorderFeatures,
  useSaveFeature,
  useStorefrontFeatures,
} from "@/features/site-settings/hooks/use-storefront-content"
import { featureSchema, type FeatureSchema } from "@/features/site-settings/schemas/storefront-content-schemas"
import { STOREFRONT_FEATURES_MAX, type StorefrontFeature } from "@/features/site-settings/types"

type DialogState = { mode: "create" } | { mode: "edit"; feature: StorefrontFeature } | null

export function FeaturesPage() {
  const { data, isLoading } = useStorefrontFeatures()
  const reorder = useReorderFeatures()
  const remove = useDeleteFeature()
  const [dialog, setDialog] = useState<DialogState>(null)
  const limitReached = (data?.length ?? 0) >= STOREFRONT_FEATURES_MAX

  return (
    <SettingsPageShell
      icon={Sparkles}
      title="Nos Atouts"
      description="Cartes avec image affichées dans la section « Nos Atouts » de l'accueil. La grille s'adapte au nombre de cartes ; sans carte, la section est masquée."
      className="max-w-3xl"
      actions={
        <Button type="button" onClick={() => setDialog({ mode: "create" })} disabled={!data || limitReached}>
          <Plus />
          Ajouter un atout
        </Button>
      }
    >
      {isLoading || !data ? (
        <Skeleton className="h-96 w-full" />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Cartes</CardTitle>
            <CardDescription>Utilisez les flèches pour changer l&apos;ordre d&apos;affichage.</CardDescription>
            <CapacityMeter count={data.length} max={STOREFRONT_FEATURES_MAX} label="Cartes créées" />
          </CardHeader>
          <CardContent>
            {data.length === 0 ? (
              <ContentEmptyState
                icon={Sparkles}
                title="Aucun atout"
                description="Ajoutez une première carte (titre, description et image) pour afficher la section."
              />
            ) : (
              <ol className="space-y-2">
                {data.map((feature, index) => (
                  <ContentItemRow
                    key={feature.id}
                    index={index}
                    total={data.length}
                    image={feature.image_url}
                    title={feature.title}
                    subtitle={feature.description}
                    busy={reorder.isPending || remove.isPending}
                    onMove={(from, to) => reorder.mutate(moveId(data.map((f) => f.id), from, to))}
                    onEdit={() => setDialog({ mode: "edit", feature })}
                    onDelete={() => remove.mutate(feature.id)}
                    deleteLabel="Supprimer"
                  />
                ))}
              </ol>
            )}
          </CardContent>
        </Card>
      )}

      <Dialog open={dialog !== null} onOpenChange={(open) => !open && setDialog(null)}>
        <DialogContent className="sm:max-w-lg">
          {dialog && (
            <FeatureForm
              key={dialog.mode === "edit" ? dialog.feature.id : "create"}
              feature={dialog.mode === "edit" ? dialog.feature : null}
              onDone={() => setDialog(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </SettingsPageShell>
  )
}

function FeatureForm({ feature, onDone }: { feature: StorefrontFeature | null; onDone: () => void }) {
  const mutation = useSaveFeature()
  const form = useForm<FeatureSchema>({
    resolver: zodResolver(featureSchema),
    defaultValues: {
      title: feature?.title ?? "",
      description: feature?.description ?? "",
      image: null,
    },
  })
  const {
    register,
    control,
    setError,
    formState: { errors },
  } = form

  const onSubmit = form.handleSubmit((values) => {
    if (!feature && !values.image) {
      setError("image", { message: "L'image est requise." })
      return
    }

    mutation.mutate(
      {
        id: feature?.id,
        title: values.title,
        description: values.description || null,
        image: values.image ?? undefined,
      },
      { onSuccess: onDone }
    )
  })

  return (
    <form onSubmit={onSubmit} noValidate>
      <DialogHeader>
        <DialogTitle>{feature ? "Modifier l'atout" : "Nouvel atout"}</DialogTitle>
        <DialogDescription>Carte affichée dans la section « Nos Atouts ».</DialogDescription>
      </DialogHeader>

      <FieldGroup className="gap-4 py-4">
        <Field data-invalid={!!errors.title}>
          <FieldLabel htmlFor="feature-title">Titre</FieldLabel>
          <Input
            id="feature-title"
            maxLength={80}
            placeholder="Vision Nocturne 4K"
            aria-invalid={!!errors.title}
            {...register("title")}
          />
          <FieldError errors={errors.title ? [errors.title] : undefined} />
        </Field>

        <Field data-invalid={!!errors.description}>
          <FieldLabel htmlFor="feature-description">
            Description <span className="font-normal text-muted-foreground">(facultatif)</span>
          </FieldLabel>
          <Textarea
            id="feature-description"
            rows={3}
            maxLength={200}
            placeholder="Des images nettes jour et nuit grâce aux capteurs infrarouges."
            aria-invalid={!!errors.description}
            {...register("description")}
          />
          <FieldError errors={errors.description ? [errors.description] : undefined} />
        </Field>

        <Field data-invalid={!!errors.image}>
          <FieldLabel htmlFor="feature-image">Image</FieldLabel>
          <Controller
            control={control}
            name="image"
            render={({ field }) => (
              <ImageInput
                id="feature-image"
                value={field.value}
                currentUrl={feature?.image_url ?? null}
                onChange={field.onChange}
                invalid={!!errors.image}
              />
            )}
          />
          <FieldError errors={errors.image ? [errors.image] : undefined} />
        </Field>
      </FieldGroup>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onDone}>
          Annuler
        </Button>
        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? "Enregistrement…" : "Enregistrer"}
        </Button>
      </DialogFooter>
    </form>
  )
}
