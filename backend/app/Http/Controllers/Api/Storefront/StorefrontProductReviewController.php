<?php

namespace App\Http\Controllers\Api\Storefront;

use App\Http\Controllers\Controller;
use App\Http\Requests\Catalog\StoreProductReviewRequest;
use App\Models\Catalog\Product;
use Illuminate\Http\JsonResponse;

class StorefrontProductReviewController extends Controller
{
    public function store(StoreProductReviewRequest $request, Product $product): JsonResponse
    {
        abort_unless($product->is_active, 404);

        $product->reviews()->create($request->validated());

        return response()->json([
            'message' => 'Merci, votre avis a été soumis et sera visible après validation.',
        ], 201);
    }
}
