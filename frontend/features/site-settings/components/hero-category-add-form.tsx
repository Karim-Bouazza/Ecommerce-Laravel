"use client"

import { type ChangeEvent, useRef, useState } from "react"
import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { CategorySelect } from "@/features/categories/components/category-select"
import { useCreateHeroCategory } from "@/features/site-settings/hooks/use-hero-categories-mutations"
import type { HeroCategory } from "@/features/site-settings/types"

export function HeroCategoryAddForm({ existing }: { existing: HeroCategory[] }) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [categoryId, setCategoryId] = useState<number | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const mutation = useCreateHeroCategory()

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    setFile(event.target.files?.[0] ?? null)
  }

  function handleSubmit() {
    if (!categoryId || !file) return

    mutation.mutate(
      { category_id: categoryId, image: file },
      {
        onSuccess: () => {
          setCategoryId(null)
          setFile(null)
          if (fileInputRef.current) fileInputRef.current.value = ""
        },
      }
    )
  }

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-dashed p-4 sm:flex-row sm:items-end">
      <div className="min-w-0 flex-1 space-y-1.5">
        <span className="text-xs font-medium text-muted-foreground">Catégorie</span>
        <CategorySelect
          value={categoryId}
          onChange={setCategoryId}
          excludeIds={existing.map((item) => item.category_id)}
        />
      </div>

      <div className="min-w-0 flex-1 space-y-1.5">
        <span className="text-xs font-medium text-muted-foreground">Image</span>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          onChange={handleFileChange}
          className="block w-full text-sm text-muted-foreground file:mr-3 file:rounded-md file:border-0 file:bg-muted file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-foreground hover:file:bg-muted/70"
        />
      </div>

      <Button
        type="button"
        onClick={handleSubmit}
        disabled={!categoryId || !file || mutation.isPending}
      >
        <Plus />
        {mutation.isPending ? "Ajout…" : "Ajouter"}
      </Button>
    </div>
  )
}
