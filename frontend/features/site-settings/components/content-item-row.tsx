"use client"

import { type ReactNode, useState } from "react"
import { ArrowDown, ArrowUp, ImageOff, Pencil, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

type ContentItemRowProps = {
  index: number
  total: number
  image: string | null
  title: string
  subtitle?: ReactNode
  badges?: ReactNode
  busy?: boolean
  onMove: (from: number, to: number) => void
  onEdit?: () => void
  onDelete: () => void
  deleteLabel: string
}

/**
 * One reorderable line of a homepage block: position, thumbnail, text and actions.
 */
export function ContentItemRow({
  index,
  total,
  image,
  title,
  subtitle,
  badges,
  busy = false,
  onMove,
  onEdit,
  onDelete,
  deleteLabel,
}: ContentItemRowProps) {
  const [confirmOpen, setConfirmOpen] = useState(false)

  return (
    <li className="flex items-center gap-3 rounded-xl border bg-card p-3 transition-colors hover:bg-muted/40">
      <span
        aria-label={`Position ${index + 1}`}
        className="flex size-7 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold tabular-nums text-muted-foreground"
      >
        {index + 1}
      </span>

      {image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={image} alt="" className="size-14 shrink-0 rounded-lg object-cover" />
      ) : (
        <div className="flex size-14 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
          <ImageOff aria-hidden="true" className="size-5" />
        </div>
      )}

      <div className="min-w-0 flex-1 space-y-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="truncate text-sm font-semibold text-foreground">{title}</p>
          {badges}
        </div>
        {subtitle && <div className="line-clamp-2 text-xs text-muted-foreground">{subtitle}</div>}
      </div>

      <div className="flex shrink-0 items-center gap-0.5">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          disabled={index === 0 || busy}
          onClick={() => onMove(index, index - 1)}
          aria-label={`Monter « ${title} »`}
        >
          <ArrowUp />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          disabled={index === total - 1 || busy}
          onClick={() => onMove(index, index + 1)}
          aria-label={`Descendre « ${title} »`}
        >
          <ArrowDown />
        </Button>
        {onEdit && (
          <Button type="button" variant="ghost" size="icon" onClick={onEdit} aria-label={`Modifier « ${title} »`}>
            <Pencil />
          </Button>
        )}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-destructive"
          disabled={busy}
          onClick={() => setConfirmOpen(true)}
          aria-label={`${deleteLabel} « ${title} »`}
        >
          <Trash2 />
        </Button>
      </div>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{deleteLabel} ?</DialogTitle>
            <DialogDescription>
              « {title} » ne sera plus affiché sur la boutique.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setConfirmOpen(false)}>
              Annuler
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={() => {
                onDelete()
                setConfirmOpen(false)
              }}
            >
              {deleteLabel}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </li>
  )
}

/** Returns the ids in their new order after moving one item. */
export function moveId(ids: number[], from: number, to: number): number[] {
  const next = [...ids]
  const [moved] = next.splice(from, 1)
  next.splice(to, 0, moved)
  return next
}
