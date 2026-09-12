<?php

namespace App\Http\Controllers\Api;

use App\Enums\WalletTransactionCategory;
use App\Enums\WalletTransactionType;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreWalletDepositRequest;
use App\Http\Requests\StoreWalletRequest;
use App\Http\Requests\StoreWalletTransferRequest;
use App\Http\Requests\StoreWalletWithdrawalRequest;
use App\Http\Requests\UpdateWalletRequest;
use App\Http\Resources\WalletResource;
use App\Http\Resources\WalletTransactionResource;
use App\Models\Wallet;
use App\Models\WalletTransaction;
use App\Services\Wallets\CreateWalletService;
use App\Services\Wallets\DeleteWalletService;
use App\Services\Wallets\DepositToWalletService;
use App\Services\Wallets\TransferBetweenWalletsService;
use App\Services\Wallets\UpdateWalletService;
use App\Services\Wallets\WithdrawFromWalletService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use RuntimeException;

class WalletController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        abort_unless(auth()->user()->hasPermission('portefeuilles.view'), 403);

        $perPage = (int) $request->input('per_page', 15);
        $search = trim((string) $request->input('search', ''));

        $wallets = Wallet::query()
            ->withSum(['transactions as entries_sum_amount' => fn ($query) => $query->where('type', WalletTransactionType::In)], 'amount')
            ->withSum(['transactions as exits_sum_amount' => fn ($query) => $query->where('type', WalletTransactionType::Out)], 'amount')
            ->when($search !== '', fn ($query) => $query->where('name', 'like', "%{$search}%"))
            ->orderByDesc('created_at')
            ->paginate($perPage)
            ->withQueryString();

        return WalletResource::collection($wallets);
    }

    public function store(StoreWalletRequest $request): JsonResponse
    {
        $wallet = app(CreateWalletService::class)->execute($request->validated());

        return (new WalletResource($wallet))->response()->setStatusCode(201);
    }

    public function update(UpdateWalletRequest $request, Wallet $wallet): WalletResource
    {
        $wallet = app(UpdateWalletService::class)->execute($wallet, $request->validated());

        return new WalletResource($wallet);
    }

    public function deposit(StoreWalletDepositRequest $request, Wallet $wallet): JsonResponse
    {
        try {
            app(DepositToWalletService::class)->execute($wallet, $request->validated());
        } catch (RuntimeException $exception) {
            return response()->json(['message' => $exception->getMessage()], 422);
        }

        return response()->json(['message' => 'Entrée enregistrée.']);
    }

    public function withdraw(StoreWalletWithdrawalRequest $request, Wallet $wallet): JsonResponse
    {
        try {
            app(WithdrawFromWalletService::class)->execute($wallet, $request->validated());
        } catch (RuntimeException $exception) {
            return response()->json(['message' => $exception->getMessage()], 422);
        }

        return response()->json(['message' => 'Sortie enregistrée.']);
    }

    public function destroy(Wallet $wallet): JsonResponse
    {
        abort_unless(auth()->user()->hasPermission('portefeuilles.delete'), 403);

        app(DeleteWalletService::class)->execute($wallet);

        return response()->json(['message' => 'Portefeuille supprimé.']);
    }

    public function transactions(Request $request, Wallet $wallet): AnonymousResourceCollection
    {
        abort_unless(auth()->user()->hasPermission('portefeuilles.view'), 403);

        $perPage = (int) $request->input('per_page', 15);
        $category = $request->input('category');
        $search = trim((string) $request->input('search', ''));

        $transactions = $wallet->transactions()
            ->when(
                $category && $category !== 'all',
                fn ($query) => $query->where('category', WalletTransactionCategory::from($category))
            )
            ->when($search !== '', fn ($query) => $query->where('reference', 'like', "%{$search}%"))
            ->orderByDesc('created_at')
            ->paginate($perPage)
            ->withQueryString();

        return WalletTransactionResource::collection($transactions);
    }

    public function transfer(StoreWalletTransferRequest $request): JsonResponse
    {
        try {
            app(TransferBetweenWalletsService::class)->execute($request->validated());
        } catch (RuntimeException $exception) {
            return response()->json(['message' => $exception->getMessage()], 422);
        }

        return response()->json(['message' => 'Transfert effectué.']);
    }

    public function stats(): JsonResponse
    {
        abort_unless(auth()->user()->hasPermission('portefeuilles.view'), 403);

        return response()->json([
            'balance' => (int) Wallet::query()->sum('balance'),
            'entries' => (int) WalletTransaction::query()->where('type', WalletTransactionType::In)->sum('amount'),
            'exits' => (int) WalletTransaction::query()->where('type', WalletTransactionType::Out)->sum('amount'),
        ]);
    }
}
