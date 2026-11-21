<?php

namespace App\Http\Controllers\Api\Order;

use App\Http\Controllers\Controller;
use App\Data\Order\ClientData;
use App\Data\Order\UpdateClientData;
use App\Models\Order\Client;
use App\Services\Clients\DeleteClientService;
use App\Services\Clients\ToggleClientBlacklistService;
use App\Services\Clients\UpdateClientService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use RuntimeException;
use Spatie\LaravelData\PaginatedDataCollection;

class ClientController extends Controller
{
    public function index(Request $request): PaginatedDataCollection
    {
        $perPage = (int) $request->input('per_page', 15);
        $search = trim((string) $request->input('search', ''));

        $clients = $this->baseQuery($search)
            ->where('is_blacklisted', false)
            ->orderByDesc('created_at')
            ->paginate($perPage)
            ->withQueryString();

        $clients->through(fn (Client $client) => ClientData::fromClient($client));

        return ClientData::collect($clients, PaginatedDataCollection::class);
    }

    public function blacklisted(Request $request): PaginatedDataCollection
    {
        $perPage = (int) $request->input('per_page', 15);
        $search = trim((string) $request->input('search', ''));

        $clients = $this->baseQuery($search)
            ->where('is_blacklisted', true)
            ->orderByDesc('blacklisted_at')
            ->paginate($perPage)
            ->withQueryString();

        $clients->through(fn (Client $client) => ClientData::fromClient($client));

        return ClientData::collect($clients, PaginatedDataCollection::class);
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

    public function update(UpdateClientData $data, Client $client): ClientData
    {
        $client = app(UpdateClientService::class)->execute($client, $data);

        return ClientData::fromClient($client->load(['wilaya', 'commune']));
    }

    public function toggleBlacklist(Client $client): ClientData
    {
        $client = app(ToggleClientBlacklistService::class)->execute($client);

        return ClientData::fromClient($client->load(['wilaya', 'commune']));
    }

    public function destroy(Client $client): JsonResponse
    {
        try {
            app(DeleteClientService::class)->execute($client);
        } catch (RuntimeException $exception) {
            return response()->json(['message' => $exception->getMessage()], 422);
        }

        return response()->json(['message' => 'Client supprimé.']);
    }
}
