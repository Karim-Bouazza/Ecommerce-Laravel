<?php

namespace App\Http\Controllers\Api\Finance;

use App\Enums\Wallet\WalletTransactionCategory;
use App\Enums\Wallet\WalletTransactionType;
use App\Http\Controllers\Controller;
use App\Data\Finance\SaveWalletData;
use App\Data\Finance\WalletData;
use App\Data\Finance\WalletMovementData;
use App\Data\Finance\WalletTransactionData;
use App\Data\Finance\WalletTransferData;
use App\Models\Finance\Wallet;
use App\Models\Finance\WalletTransaction;
use App\Services\Wallets\CreateWalletService;
use App\Services\Wallets\DeleteWalletService;
use App\Services\Wallets\DepositToWalletService;
use App\Services\Wallets\TransferBetweenWalletsService;
use App\Services\Wallets\UpdateWalletService;
use App\Services\Wallets\WithdrawFromWalletService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use RuntimeException;
use Spatie\LaravelData\PaginatedDataCollection;

class WalletController extends Controller
{
    public function index(Request $request): PaginatedDataCollection
    {
        $perPage = (int) $request->input('per_page', 15);
        $search = trim((string) $request->input('search', ''));

        $wallets = Wallet::query()
            ->withSum(['transactions as entries_sum_amount' => fn ($query) => $query->where('type', WalletTransactionType::In)], 'amount')
            ->withSum(['transactions as exits_sum_amount' => fn ($query) => $query->where('type', WalletTransactionType::Out)], 'amount')
            ->when($search !== '', fn ($query) => $query->where('name', 'like', "%{$search}%"))
            ->orderByDesc('created_at')
            ->paginate($perPage)
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
        $perPage = (int) $request->input('per_page', 15);
        $category = $request->input('category');
        $search = trim((string) $request->input('search', ''));

        $transactions = $wallet->transactions()
            ->with('creator')
            ->when(
                $category && $category !== 'all',
                fn ($query) => $query->where('category', WalletTransactionCategory::from($category))
            )
            ->when($search !== '', fn ($query) => $query->where('reference', 'like', "%{$search}%"))
            ->orderByDesc('created_at')
            ->paginate($perPage)
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
