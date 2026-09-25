"use client"

import { keepPreviousData, useQuery } from "@tanstack/react-query"

import {
  getProductReviews,
  type GetProductReviewsParams,
} from "@/features/product-reviews/api/product-review-api"

export function useProductReviewList(params: GetProductReviewsParams) {
  return useQuery({
    queryKey: ["product-reviews", "list", params],
    queryFn: () => getProductReviews(params),
    placeholderData: keepPreviousData,
  })
}
