<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateClientRequest;
use App\Http\Resources\ClientResource;
use App\Models\Client;
use App\Services\Clients\DeleteClientService;
use App\Services\Clients\ToggleClientBlacklistService;
use App\Services\Clients\UpdateClientService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use RuntimeException;

class ClientController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        abort_unless(auth()->user()->hasPermission('clients.view'), 403);

        $perPage = (int) $request->input('per_page', 15);
        $search = trim((string) $request->input('search', ''));

        $clients = $this->baseQuery($search)
            ->where('is_blacklisted', false)
            ->orderByDesc('created_at')
            ->paginate($perPage)
            ->withQueryString();

        return ClientResource::collection($clients);
    }

    public function blacklisted(Request $request): AnonymousResourceCollection
    {
        abort_unless(auth()->user()->hasPermission('clients_blacklist.view'), 403);

        $perPage = (int) $request->input('per_page', 15);
        $search = trim((string) $request->input('search', ''));

        $clients = $this->baseQuery($search)
            ->where('is_blacklisted', true)
            ->orderByDesc('blacklisted_at')
            ->paginate($perPage)
            ->withQueryString();

        return ClientResource::collection($clients);
    }

    private function baseQuery(string $search)
    {
        return Client::query()
            ->with(['wilaya', 'commune'])
            ->when($search !== '', function ($query) use ($search) {
                $query->where(function ($query) use ($search) {
                    $query->where('first_name', 'like', "%{$search}%")
                        ->orWhere('last_name', 'like', "%{$search}%")
                        ->orWhere('phone_number', 'like', "%{$search}%")
                        ->orWhereHas('wilaya', fn ($query) => $query->where('name', 'like', "%{$search}%"))
                        ->orWhereHas('commune', fn ($query) => $query->where('name', 'like', "%{$search}%"));
                });
            });
    }

    public function update(UpdateClientRequest $request, Client $client): ClientResource
    {
        $client = app(UpdateClientService::class)->execute($client, $request->validated());

        return new ClientResource($client->load(['wilaya', 'commune']));
    }

    public function toggleBlacklist(Client $client): ClientResource
    {
        abort_unless(auth()->user()->hasPermission('clients.edit'), 403);

        $client = app(ToggleClientBlacklistService::class)->execute($client);

        return new ClientResource($client->load(['wilaya', 'commune']));
    }

    public function destroy(Client $client): JsonResponse
    {
        abort_unless(auth()->user()->hasPermission('clients.delete'), 403);

        try {
            app(DeleteClientService::class)->execute($client);
        } catch (RuntimeException $exception) {
            return response()->json(['message' => $exception->getMessage()], 422);
        }

        return response()->json(['message' => 'Client supprimé.']);
    }
}
