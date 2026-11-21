<?php

namespace App\Http\Controllers\Api\Order;

use App\Data\Order\ClientData;
use App\Data\Order\UpdateClientData;
use App\Http\Controllers\Controller;
use App\Models\Order\Client;
use App\Services\Clients\DeleteClientService;
use App\Services\Clients\ToggleClientBlacklistService;
use App\Services\Clients\UpdateClientService;
use App\Support\Query\Filters\SearchFilter;
use App\Support\Query\ListQuery;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use RuntimeException;
use Spatie\LaravelData\PaginatedDataCollection;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\QueryBuilder;

class ClientController extends Controller
{
    public function index(Request $request): PaginatedDataCollection
    {
        $clients = $this->baseQuery($request)
            ->where('is_blacklisted', false)
            ->defaultSort('-created_at')
            ->paginate(ListQuery::perPage($request))
            ->withQueryString();

        $clients->through(fn (Client $client) => ClientData::fromClient($client));

        return ClientData::collect($clients, PaginatedDataCollection::class);
    }

    public function blacklisted(Request $request): PaginatedDataCollection
    {
        $clients = $this->baseQuery($request)
            ->where('is_blacklisted', true)
            ->defaultSort('-blacklisted_at')
            ->paginate(ListQuery::perPage($request))
            ->withQueryString();

        $clients->through(fn (Client $client) => ClientData::fromClient($client));

        return ClientData::collect($clients, PaginatedDataCollection::class);
    }

    private function baseQuery(Request $request): QueryBuilder
    {
        return QueryBuilder::for(
            Client::query()->with(['wilaya', 'commune']),
            ListQuery::request($request, ['search']),
        )
            ->allowedFilters(
                AllowedFilter::custom('search', new SearchFilter(
                    ['first_name', 'last_name', 'phone_number'],
                    ['wilaya' => ['name'], 'commune' => ['name']],
                )),
            )
            ->allowedSorts('first_name', 'last_name', 'created_at', 'blacklisted_at');
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
