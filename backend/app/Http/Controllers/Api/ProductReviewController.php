<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateProductReviewRequest;
use App\Http\Resources\ProductReviewResource;
use App\Models\ProductReview;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class ProductReviewController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        abort_unless(auth()->user()->hasPermission('product_reviews.view'), 403);

        $perPage = (int) $request->input('per_page', 15);
        $status = $request->input('status');
        $productId = $request->input('product_id');

        $reviews = ProductReview::query()
            ->with('product')
            ->when($status === 'approved', fn ($query) => $query->where('is_approved', true))
            ->when($status === 'pending', fn ($query) => $query->where('is_approved', false))
            ->when($productId, fn ($query) => $query->where('product_id', $productId))
            ->orderByDesc('created_at')
            ->paginate($perPage)
            ->withQueryString();

        return ProductReviewResource::collection($reviews);
    }

    public function update(UpdateProductReviewRequest $request, ProductReview $productReview): ProductReviewResource
    {
        $productReview->update($request->validated());

        return new ProductReviewResource($productReview->fresh()->load('product'));
    }

    public function destroy(ProductReview $productReview): JsonResponse
    {
        abort_unless(auth()->user()->hasPermission('product_reviews.delete'), 403);

        $productReview->delete();

        return response()->json(['message' => 'Avis supprimé.']);
    }
}
