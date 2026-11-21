<?php

namespace App\Http\Controllers\Api\Finance;

use App\Data\Finance\SaveWalletData;
use App\Data\Finance\WalletData;
use App\Data\Finance\WalletMovementData;
use App\Data\Finance\WalletTransactionData;
use App\Data\Finance\WalletTransferData;
use App\Enums\Wallet\WalletTransactionCategory;
use App\Enums\Wallet\WalletTransactionType;
use App\Http\Controllers\Controller;
use App\Models\Finance\Wallet;
use App\Models\Finance\WalletTransaction;
use App\Services\Wallets\CreateWalletService;
use App\Services\Wallets\DeleteWalletService;
use App\Services\Wallets\DepositToWalletService;
use App\Services\Wallets\TransferBetweenWalletsService;
use App\Services\Wallets\UpdateWalletService;
use App\Services\Wallets\WithdrawFromWalletService;
use App\Support\Query\Filters\SearchFilter;
use App\Support\Query\ListQuery;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use RuntimeException;
use Spatie\LaravelData\PaginatedDataCollection;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\QueryBuilder;

class WalletController extends Controller
{
    public function index(Request $request): PaginatedDataCollection
    {
        $wallets = QueryBuilder::for(
            Wallet::query()
                ->withSum(['transactions as entries_sum_amount' => fn ($query) => $query->where('type', WalletTransactionType::In)], 'amount')
                ->withSum(['transactions as exits_sum_amount' => fn ($query) => $query->where('type', WalletTransactionType::Out)], 'amount'),
            ListQuery::request($request, ['search']),
        )
            ->allowedFilters(AllowedFilter::custom('search', new SearchFilter(['name'])))
            ->allowedSorts('name', 'balance', 'created_at')
            ->defaultSort('-created_at')
            ->paginate(ListQuery::perPage($request))
            ->withQueryString();

        $wallets->through(fn (Wallet $wallet) => WalletData::fromWallet($wallet));

        return WalletData::collect($wallets, PaginatedDataCollection::class);
    }

    public function store(SaveWalletData $data): JsonResponse
    {
        $wallet = app(CreateWalletService::class)->execute($data);

        return WalletData::fromWallet($wallet)->toResponse(request())->setStatusCode(201);
    }

    public function update(SaveWalletData $data, Wallet $wallet): WalletData
    {
        $wallet = app(UpdateWalletService::class)->execute($wallet, $data);

        return WalletData::fromWallet($wallet);
    }

    public function deposit(WalletMovementData $data, Wallet $wallet): JsonResponse
    {
        try {
            app(DepositToWalletService::class)->execute($wallet, $data);
        } catch (RuntimeException $exception) {
            return response()->json(['message' => $exception->getMessage()], 422);
        }

        return response()->json(['message' => 'Entrée enregistrée.']);
    }

    public function withdraw(WalletMovementData $data, Wallet $wallet): JsonResponse
    {
        try {
            app(WithdrawFromWalletService::class)->execute($wallet, $data);
        } catch (RuntimeException $exception) {
            return response()->json(['message' => $exception->getMessage()], 422);
        }

        return response()->json(['message' => 'Sortie enregistrée.']);
    }

    public function destroy(Wallet $wallet): JsonResponse
    {
        app(DeleteWalletService::class)->execute($wallet);

        return response()->json(['message' => 'Portefeuille supprimé.']);
    }

    public function transactions(Request $request, Wallet $wallet): PaginatedDataCollection
    {
        $transactions = QueryBuilder::for(
            $wallet->transactions()->with('creator'),
            ListQuery::request($request, ['category', 'search']),
        )
            ->allowedFilters(
                AllowedFilter::callback('category', fn ($query, $value) => $value === 'all'
                    ? $query
                    : $query->where('category', WalletTransactionCategory::from($value))),
                AllowedFilter::custom('search', new SearchFilter(['reference'])),
            )
            ->allowedSorts('created_at', 'amount')
            ->defaultSort('-created_at')
            ->paginate(ListQuery::perPage($request))
            ->withQueryString();

        $transactions->through(fn (WalletTransaction $transaction) => WalletTransactionData::fromTransaction($transaction));

        return WalletTransactionData::collect($transactions, PaginatedDataCollection::class);
    }

    public function transfer(WalletTransferData $data): JsonResponse
    {
        try {
            app(TransferBetweenWalletsService::class)->execute($data);
        } catch (RuntimeException $exception) {
            return response()->json(['message' => $exception->getMessage()], 422);
        }

        return response()->json(['message' => 'Transfert effectué.']);
    }

    public function stats(): JsonResponse
    {
        return response()->json([
            'balance' => (int) Wallet::query()->sum('balance'),
            'entries' => (int) WalletTransaction::query()->where('type', WalletTransactionType::In)->sum('amount'),
            'exits' => (int) WalletTransaction::query()->where('type', WalletTransactionType::Out)->sum('amount'),
        ]);
    }
}
