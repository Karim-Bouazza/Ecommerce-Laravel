<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreTagRequest;
use App\Http\Requests\UpdateTagRequest;
use App\Http\Resources\TagResource;
use App\Models\Tag;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class TagController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        abort_unless(auth()->user()->hasPermission('tags.view'), 403);

        $perPage = (int) $request->input('per_page', 15);
        $search = trim((string) $request->input('search', ''));

        $tags = Tag::query()
            ->withCount('products')
            ->when($search !== '', function ($query) use ($search) {
                $query->where('name', 'like', "%{$search}%");
            })
            ->orderByDesc('created_at')
            ->paginate($perPage)
            ->withQueryString();

        return TagResource::collection($tags);
    }

    public function options()
    {
        return Tag::query()
            ->orderBy('name')
            ->get(['id', 'name']);
    }

    public function store(StoreTagRequest $request): TagResource
    {
        $tag = Tag::create($request->validated());

        return new TagResource($tag->loadCount('products'));
    }

    public function update(UpdateTagRequest $request, Tag $tag): TagResource
    {
        $tag->update($request->validated());

        return new TagResource($tag->fresh()->loadCount('products'));
    }

    public function destroy(Tag $tag): JsonResponse
    {
        abort_unless(auth()->user()->hasPermission('tags.delete'), 403);

        $tag->delete();

        return response()->json(['message' => 'Étiquette supprimée.']);
    }
}
