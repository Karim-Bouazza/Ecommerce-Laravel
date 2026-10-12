"use client"

import { type ComponentType, useState } from "react"
import { PackageSearch, Plus } from "lucide-react"

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
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { useProductOptions } from "@/features/products/hooks/use-product-options"
import { CapacityMeter } from "@/features/site-settings/components/capacity-meter"
import { ContentEmptyState } from "@/features/site-settings/components/content-empty-state"
import { ContentItemRow, moveId } from "@/features/site-settings/components/content-item-row"
import { SettingsPageShell } from "@/features/site-settings/components/settings-page-shell"
import {
  STOREFRONT_SECTIONS,
  type StorefrontSectionConfig,
} from "@/features/site-settings/constants/storefront-sections"
import {
  useAddSectionProduct,
  useRemoveSectionProduct,
  useReorderSectionProducts,
  useSectionProducts,
  useUpdateSectionProductLabel,
} from "@/features/site-settings/hooks/use-storefront-content"
import type { SectionProduct, StorefrontSection } from "@/features/site-settings/types"
import { formatPrice } from "@/shared/lib/format-price"

type SectionProductsPageProps = {
  section: StorefrontSection
  icon: ComponentType<{ className?: string }>
}

export function SectionProductsPage({ section, icon }: SectionProductsPageProps) {
  const config = STOREFRONT_SECTIONS[section]
  const { data, isLoading } = useSectionProducts(section)

  return (
    <SettingsPageShell icon={icon} title={config.title} description={config.description} className="max-w-3xl">
      {isLoading || !data ? (
        <Skeleton className="h-96 w-full" />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Produits sélectionnés</CardTitle>
            <CardDescription>
              Les produits inactifs restent dans la liste mais ne sont pas affichés. Sans produit,
              la section est masquée sur la boutique.
            </CardDescription>
            <CapacityMeter count={data.length} max={config.max} label="Produits sélectionnés" />
          </CardHeader>
          <CardContent className="space-y-4">
            <SectionProductList config={config} items={data} />
            <SectionProductAddForm config={config} existing={data} />
          </CardContent>
        </Card>
      )}
    </SettingsPageShell>
  )
}

function SectionProductList({ config, items }: { config: StorefrontSectionConfig; items: SectionProduct[] }) {
  const reorder = useReorderSectionProducts(config.section)
  const remove = useRemoveSectionProduct(config.section)
  const [editing, setEditing] = useState<SectionProduct | null>(null)

  if (items.length === 0) {
    return (
      <ContentEmptyState
        icon={PackageSearch}
        title="Aucun produit sélectionné"
        description="Ajoutez un produit ci-dessous pour afficher cette section sur l'accueil."
      />
    )
  }

  return (
    <>
      <ol className="space-y-2">
        {items.map((item, index) => {
          const slot = config.slotLabel(index)

          return (
            <ContentItemRow
              key={item.id}
              index={index}
              total={items.length}
              image={item.image}
              title={item.name}
              subtitle={
                <>
                  {formatPrice(item.price)}
                  {config.labelField && item.label && (
                    <>
                      {" · "}
                      {config.labelField.name} : « {item.label} »
                    </>
                  )}
                </>
              }
              badges={
                <>
                  {slot && <Badge variant="secondary">{slot}</Badge>}
                  {!item.is_active && <Badge variant="outline">Inactif — masqué</Badge>}
                </>
              }
              busy={reorder.isPending || remove.isPending}
              onMove={(from, to) => reorder.mutate(moveId(items.map((i) => i.id), from, to))}
              onEdit={config.labelField ? () => setEditing(item) : undefined}
              onDelete={() => remove.mutate(item.id)}
              deleteLabel="Retirer"
            />
          )
        })}
      </ol>

      {config.labelField && (
        <EditLabelDialog config={config} item={editing} onClose={() => setEditing(null)} />
      )}
    </>
  )
}

function EditLabelDialog({
  config,
  item,
  onClose,
}: {
  config: StorefrontSectionConfig
  item: SectionProduct | null
  onClose: () => void
}) {
  const mutation = useUpdateSectionProductLabel(config.section)

  return (
    <Dialog open={!!item} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        {item && (
          <form
            key={item.id}
            onSubmit={(event) => {
              event.preventDefault()
              const label = String(new FormData(event.currentTarget).get("label") ?? "").trim()
              mutation.mutate({ id: item.id, label: label || null }, { onSuccess: onClose })
            }}
          >
            <DialogHeader>
              <DialogTitle>{config.labelField?.name}</DialogTitle>
              <DialogDescription>{item.name}</DialogDescription>
            </DialogHeader>
            <Field className="py-4">
              <FieldLabel htmlFor="section-product-label">{config.labelField?.name}</FieldLabel>
              <Input
                id="section-product-label"
                name="label"
                maxLength={60}
                defaultValue={item.label ?? ""}
                placeholder={config.labelField?.placeholder}
              />
              <FieldDescription>{config.labelField?.help}</FieldDescription>
            </Field>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Annuler
              </Button>
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? "Enregistrement…" : "Enregistrer"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}

function SectionProductAddForm({
  config,
  existing,
}: {
  config: StorefrontSectionConfig
  existing: SectionProduct[]
}) {
  const [productId, setProductId] = useState<number | null>(null)
  const [label, setLabel] = useState("")
  const { data: allProducts = [] } = useProductOptions()
  const mutation = useAddSectionProduct(config.section)

  if (existing.length >= config.max) {
    return (
      <p className="rounded-xl border border-dashed p-4 text-sm text-muted-foreground">
        Limite de {config.max} produits atteinte. Retirez-en un pour en ajouter un autre.
      </p>
    )
  }

  const takenIds = new Set(existing.map((item) => item.product_id))
  const products = allProducts.filter((product) => !takenIds.has(product.id))
  const labelById = new Map(products.map((product) => [String(product.id), product.name]))

  function handleSubmit() {
    if (!productId) return
    mutation.mutate(
      { product_id: productId, label: label.trim() || null },
      {
        onSuccess: () => {
          setProductId(null)
          setLabel("")
        },
      }
    )
  }

  return (
    <div className="space-y-3 rounded-xl border border-dashed p-4">
      <p className="text-sm font-medium text-foreground">Ajouter un produit</p>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <Field className="min-w-0 flex-1">
          <FieldLabel htmlFor={`${config.section}-product`}>Produit</FieldLabel>
          <Select
            value={productId !== null ? String(productId) : undefined}
            onValueChange={(next) => setProductId(Number(next))}
          >
            <SelectTrigger id={`${config.section}-product`} className="w-full">
              <SelectValue placeholder="Sélectionner un produit">
                {(val: string | null) => (val ? (labelById.get(val) ?? val) : "Sélectionner un produit")}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {products.map((product) => (
                <SelectItem key={product.id} value={String(product.id)}>
                  {product.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        {config.labelField && (
          <Field className="min-w-0 flex-1">
            <FieldLabel htmlFor={`${config.section}-label`}>
              {config.labelField.name} <span className="font-normal text-muted-foreground">(facultatif)</span>
            </FieldLabel>
            <Input
              id={`${config.section}-label`}
              value={label}
              maxLength={60}
              onChange={(event) => setLabel(event.target.value)}
              placeholder={config.labelField.placeholder}
            />
          </Field>
        )}

        <Button type="button" onClick={handleSubmit} disabled={!productId || mutation.isPending}>
          <Plus />
          {mutation.isPending ? "Ajout…" : "Ajouter"}
        </Button>
      </div>
      {config.labelField && <p className="text-xs text-muted-foreground">{config.labelField.help}</p>}
    </div>
  )
}
