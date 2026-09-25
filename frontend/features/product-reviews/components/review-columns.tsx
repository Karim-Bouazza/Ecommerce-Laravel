"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { Check, Star, X } from "lucide-react"

import { cn } from "cn"
import { Button } from "@/components/ui/button"
import { DeleteReviewDialog } from "@/features/product-reviews/components/delete-review-dialog"
import { useUpdateProductReviewStatus } from "@/features/product-reviews/hooks/use-update-product-review-status"
import type { ProductReview } from "@/features/product-reviews/types"

function RatingStars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center justify-center gap-0.5">
      {Array.from({ length: 5 }, (_, index) => (
        <Star
          key={index}
          className={cn(
            "size-3.5",
            index < rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30"
          )}
        />
      ))}
    </div>
  )
}

function ReviewActions({ review }: { review: ProductReview }) {
  const { mutate, isPending } = useUpdateProductReviewStatus()

  return (
    <div className="flex items-center justify-center gap-1">
      {!review.is_approved && (
        <Button
          variant="ghost"
          size="icon"
          aria-label="Approuver"
          disabled={isPending}
          className="text-emerald-600 hover:text-emerald-600 dark:text-emerald-400"
          onClick={() => mutate({ id: review.id, is_approved: true })}
        >
          <Check className="size-4" />
        </Button>
      )}
      {review.is_approved && (
        <Button
          variant="ghost"
          size="icon"
          aria-label="Rejeter"
          disabled={isPending}
          className="text-destructive hover:text-destructive"
          onClick={() => mutate({ id: review.id, is_approved: false })}
        >
          <X className="size-4" />
        </Button>
      )}
      <DeleteReviewDialog reviewId={review.id} />
    </div>
  )
}

export const reviewColumns: ColumnDef<ProductReview>[] = [
  {
    accessorKey: "product_name",
    header: "Produit",
    cell: ({ row }) => row.original.product_name ?? <span className="text-muted-foreground">—</span>,
  },
  {
    accessorKey: "customer_name",
    header: "Client",
  },
  {
    accessorKey: "rating",
    header: "Note",
    cell: ({ row }) => <RatingStars rating={row.original.rating} />,
  },
  {
    accessorKey: "comment",
    header: "Commentaire",
    cell: ({ row }) => (
      <span className="line-clamp-2 max-w-xs text-left">
        {row.original.comment ?? <span className="text-muted-foreground">—</span>}
      </span>
    ),
    meta: { align: "left" },
  },
  {
    accessorKey: "is_approved",
    header: "Statut",
    cell: ({ row }) => (
      <span
        className={cn(
          "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
          row.original.is_approved
            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
            : "bg-amber-500/10 text-amber-600 dark:text-amber-400"
        )}
      >
        {row.original.is_approved ? "Approuvé" : "En attente"}
      </span>
    ),
  },
  {
    id: "actions",
    header: "Action",
    cell: ({ row }) => <ReviewActions review={row.original} />,
  },
]
