"use client"

import { type ChangeEvent, useRef } from "react"
import { ArrowDown, ArrowUp, ImageUp, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  useDeleteHeroCategory,
  useUpdateHeroCategory,
} from "@/features/site-settings/hooks/use-hero-categories-mutations"
import type { HeroCategory } from "@/features/site-settings/types"

function HeroCategoryRow({
  item,
  isFirst,
  isLast,
  onMoveUp,
  onMoveDown,
}: {
  item: HeroCategory
  isFirst: boolean
  isLast: boolean
  onMoveUp: () => void
  onMoveDown: () => void
}) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const updateMutation = useUpdateHeroCategory()
  const deleteMutation = useDeleteHeroCategory()

  function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    event.target.value = ""
    if (!file) return
    updateMutation.mutate({ id: item.id, image: file })
  }

  return (
    <div className="flex items-center gap-3 rounded-lg border p-3">
      {item.image_url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={item.image_url}
          alt={item.category_name}
          className="size-16 shrink-0 rounded-lg object-cover"
        />
      ) : (
        <div className="flex size-16 shrink-0 items-center justify-center rounded-lg bg-muted text-xs text-muted-foreground">
          Aucune image
        </div>
      )}

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-foreground">{item.category_name}</p>
        <p className="text-xs text-muted-foreground">
          {item.item_count} produit{item.item_count > 1 ? "s" : ""}
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-1">
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          disabled={isFirst}
          onClick={onMoveUp}
          aria-label="Monter"
        >
          <ArrowUp />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          disabled={isLast}
          onClick={onMoveDown}
          aria-label="Descendre"
        >
          <ArrowDown />
        </Button>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          className="hidden"
          onChange={handleImageChange}
        />
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={() => fileInputRef.current?.click()}
          aria-label="Changer l'image"
          disabled={updateMutation.isPending}
        >
          <ImageUp />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={() => deleteMutation.mutate(item.id)}
          aria-label="Retirer"
          disabled={deleteMutation.isPending}
        >
          <Trash2 />
        </Button>
      </div>
    </div>
  )
}

export function HeroCategoryList({ items }: { items: HeroCategory[] }) {
  const updateMutation = useUpdateHeroCategory()

  function swap(index: number, otherIndex: number) {
    const a = items[index]
    const b = items[otherIndex]
    updateMutation.mutate({ id: a.id, position: b.position })
    updateMutation.mutate({ id: b.id, position: a.position })
  }

  if (items.length === 0) {
    return (
      <p className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
        Aucune catégorie mise en avant pour le moment. Ajoutez-en une ci-dessous.
      </p>
    )
  }

  return (
    <div className="space-y-2">
      {items.map((item, index) => (
        <HeroCategoryRow
          key={item.id}
          item={item}
          isFirst={index === 0}
          isLast={index === items.length - 1}
          onMoveUp={() => swap(index, index - 1)}
          onMoveDown={() => swap(index, index + 1)}
        />
      ))}
    </div>
  )
}
