"use client"

import { useEffect, useMemo, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm, useWatch } from "react-hook-form"
import { ArrowRight, Megaphone, Plus } from "lucide-react"
import { cn } from "cn"

import { Badge } from "@/components/ui/badge"
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
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { CapacityMeter } from "@/features/site-settings/components/capacity-meter"
import { ContentEmptyState } from "@/features/site-settings/components/content-empty-state"
import { ContentItemRow, moveId } from "@/features/site-settings/components/content-item-row"
import { ImageInput } from "@/features/site-settings/components/image-input"
import { SettingsPageShell } from "@/features/site-settings/components/settings-page-shell"
import {
  useDeletePromoBanner,
  useReorderPromoBanners,
  useSavePromoBanner,
  useStorefrontPromoBanners,
} from "@/features/site-settings/hooks/use-storefront-content"
import {
  promoBannerSchema,
  type PromoBannerSchema,
} from "@/features/site-settings/schemas/storefront-content-schemas"
import { PROMO_BANNERS_MAX, type StorefrontPromoBanner } from "@/features/site-settings/types"

type DialogState = { mode: "create" } | { mode: "edit"; banner: StorefrontPromoBanner } | null

export function PromoBannersPage() {
  const { data, isLoading } = useStorefrontPromoBanners()
  const reorder = useReorderPromoBanners()
  const remove = useDeletePromoBanner()
  const [dialog, setDialog] = useState<DialogState>(null)
  const limitReached = (data?.length ?? 0) >= PROMO_BANNERS_MAX

  return (
    <SettingsPageShell
      icon={Megaphone}
      title="Bannières promotionnelles"
      description="Les grandes bannières côte à côte de l'accueil (ex. « Remise de 20% »). Sans bannière, la section est masquée."
      className="max-w-3xl"
      actions={
        <Button type="button" onClick={() => setDialog({ mode: "create" })} disabled={!data || limitReached}>
          <Plus />
          Ajouter une bannière
        </Button>
      }
    >
      {isLoading || !data ? (
        <Skeleton className="h-72 w-full" />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Bannières</CardTitle>
            <CardDescription>La première s&apos;affiche à gauche, la seconde à droite.</CardDescription>
            <CapacityMeter count={data.length} max={PROMO_BANNERS_MAX} label="Bannières créées" />
          </CardHeader>
          <CardContent>
            {data.length === 0 ? (
              <ContentEmptyState
                icon={Megaphone}
                title="Aucune bannière"
                description="Créez une bannière avec son texte, son image et le lien du bouton."
              />
            ) : (
              <ol className="space-y-2">
                {data.map((banner, index) => (
                  <ContentItemRow
                    key={banner.id}
                    index={index}
                    total={data.length}
                    image={banner.image_url}
                    title={banner.title}
                    subtitle={[banner.eyebrow, banner.link_url ?? "/products"].filter(Boolean).join(" · ")}
                    badges={banner.highlight ? <Badge variant="secondary">Fond couleur principale</Badge> : null}
                    busy={reorder.isPending || remove.isPending}
                    onMove={(from, to) => reorder.mutate(moveId(data.map((b) => b.id), from, to))}
                    onEdit={() => setDialog({ mode: "edit", banner })}
                    onDelete={() => remove.mutate(banner.id)}
                    deleteLabel="Supprimer"
                  />
                ))}
              </ol>
            )}
          </CardContent>
        </Card>
      )}

      <Dialog open={dialog !== null} onOpenChange={(open) => !open && setDialog(null)}>
        <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-3xl">
          {dialog && (
            <PromoBannerForm
              key={dialog.mode === "edit" ? dialog.banner.id : "create"}
              banner={dialog.mode === "edit" ? dialog.banner : null}
              onDone={() => setDialog(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </SettingsPageShell>
  )
}

function PromoBannerForm({ banner, onDone }: { banner: StorefrontPromoBanner | null; onDone: () => void }) {
  const mutation = useSavePromoBanner()
  const form = useForm<PromoBannerSchema>({
    resolver: zodResolver(promoBannerSchema),
    defaultValues: {
      eyebrow: banner?.eyebrow ?? "",
      title: banner?.title ?? "",
      description: banner?.description ?? "",
      button_label: banner?.button_label ?? "Acheter",
      link_url: banner?.link_url ?? "",
      highlight: banner?.highlight ?? false,
      image: null,
    },
  })
  const {
    register,
    control,
    setError,
    formState: { errors },
  } = form
  const values = useWatch({ control })

  const onSubmit = form.handleSubmit((data) => {
    if (!banner && !data.image) {
      setError("image", { message: "L'image est requise." })
      return
    }

    mutation.mutate(
      {
        id: banner?.id,
        eyebrow: data.eyebrow || null,
        title: data.title,
        description: data.description || null,
        button_label: data.button_label,
        link_url: data.link_url || null,
        highlight: data.highlight,
        image: data.image ?? undefined,
      },
      { onSuccess: onDone }
    )
  })

  return (
    <form onSubmit={onSubmit} noValidate>
      <DialogHeader>
        <DialogTitle>{banner ? "Modifier la bannière" : "Nouvelle bannière"}</DialogTitle>
        <DialogDescription>L&apos;aperçu se met à jour pendant la saisie.</DialogDescription>
      </DialogHeader>

      <div className="grid gap-6 py-4 md:grid-cols-[1fr_280px]">
        <FieldGroup className="gap-4">
          <Field data-invalid={!!errors.eyebrow}>
            <FieldLabel htmlFor="banner-eyebrow">
              Sur-titre <span className="font-normal text-muted-foreground">(facultatif)</span>
            </FieldLabel>
            <Input id="banner-eyebrow" maxLength={60} placeholder="Remise de 20%" {...register("eyebrow")} />
            <FieldError errors={errors.eyebrow ? [errors.eyebrow] : undefined} />
          </Field>

          <Field data-invalid={!!errors.title}>
            <FieldLabel htmlFor="banner-title">Titre</FieldLabel>
            <Input
              id="banner-title"
              maxLength={100}
              placeholder="Nouvelles Caméras Connectées"
              aria-invalid={!!errors.title}
              {...register("title")}
            />
            <FieldError errors={errors.title ? [errors.title] : undefined} />
          </Field>

          <Field data-invalid={!!errors.description}>
            <FieldLabel htmlFor="banner-description">
              Description <span className="font-normal text-muted-foreground">(facultatif)</span>
            </FieldLabel>
            <Textarea id="banner-description" rows={2} maxLength={200} {...register("description")} />
            <FieldError errors={errors.description ? [errors.description] : undefined} />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field data-invalid={!!errors.button_label}>
              <FieldLabel htmlFor="banner-button">Texte du bouton</FieldLabel>
              <Input
                id="banner-button"
                maxLength={30}
                aria-invalid={!!errors.button_label}
                {...register("button_label")}
              />
              <FieldError errors={errors.button_label ? [errors.button_label] : undefined} />
            </Field>

            <Field data-invalid={!!errors.link_url}>
              <FieldLabel htmlFor="banner-link">Lien du bouton</FieldLabel>
              <Input
                id="banner-link"
                placeholder="/products"
                aria-invalid={!!errors.link_url}
                {...register("link_url")}
              />
              <FieldError errors={errors.link_url ? [errors.link_url] : undefined} />
            </Field>
          </div>
          <FieldDescription className="-mt-2">
            Laissez le lien vide pour envoyer vers le catalogue. Ex. : /products?category_id=3
          </FieldDescription>

          <Field orientation="horizontal">
            <Controller
              control={control}
              name="highlight"
              render={({ field }) => (
                <Switch id="banner-highlight" checked={field.value} onCheckedChange={field.onChange} />
              )}
            />
            <FieldLabel htmlFor="banner-highlight">Fond couleur principale</FieldLabel>
          </Field>

          <Field data-invalid={!!errors.image}>
            <FieldLabel htmlFor="banner-image">Image</FieldLabel>
            <Controller
              control={control}
              name="image"
              render={({ field }) => (
                <ImageInput
                  id="banner-image"
                  value={field.value}
                  currentUrl={banner?.image_url ?? null}
                  onChange={field.onChange}
                  invalid={!!errors.image}
                />
              )}
            />
            <FieldError errors={errors.image ? [errors.image] : undefined} />
          </Field>
        </FieldGroup>

        <div className="space-y-2">
          <p className="text-sm font-medium text-foreground">Aperçu</p>
          <BannerPreview
            eyebrow={values.eyebrow ?? ""}
            title={values.title ?? ""}
            description={values.description ?? ""}
            buttonLabel={values.button_label ?? ""}
            highlight={values.highlight ?? false}
            image={values.image ?? null}
            currentUrl={banner?.image_url ?? null}
          />
        </div>
      </div>

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

function BannerPreview({
  eyebrow,
  title,
  description,
  buttonLabel,
  highlight,
  image,
  currentUrl,
}: {
  eyebrow: string
  title: string
  description: string
  buttonLabel: string
  highlight: boolean
  image: File | null
  currentUrl: string | null
}) {
  const fileUrl = useMemo(() => (image ? URL.createObjectURL(image) : null), [image])

  useEffect(() => {
    return () => {
      if (fileUrl) URL.revokeObjectURL(fileUrl)
    }
  }, [fileUrl])

  const imageUrl = fileUrl ?? currentUrl

  return (
    <div
      aria-hidden="true"
      className={cn(
        "relative flex min-h-56 overflow-hidden rounded-2xl border",
        highlight ? "bg-primary text-primary-foreground" : "bg-muted/60 text-foreground"
      )}
    >
      <div className="relative z-10 flex w-3/5 flex-col justify-center gap-1.5 p-4">
        {eyebrow && <p className="text-[11px]">{eyebrow}</p>}
        <p className="line-clamp-3 text-base leading-tight font-bold">{title || "Titre de la bannière"}</p>
        {description && (
          <p
            className={cn(
              "line-clamp-2 text-[10px]",
              highlight ? "text-primary-foreground/80" : "text-muted-foreground"
            )}
          >
            {description}
          </p>
        )}
        <span className="mt-2 inline-flex w-fit items-center gap-1 rounded-full bg-foreground px-3 py-1.5 text-[10px] font-semibold text-background">
          {buttonLabel || "Acheter"}
          <ArrowRight className="size-3" />
        </span>
      </div>
      <div className="absolute inset-y-0 right-0 w-2/5 bg-muted">
        {imageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={imageUrl} alt="" className="absolute inset-0 h-full w-full object-cover" />
        )}
      </div>
    </div>
  )
}
