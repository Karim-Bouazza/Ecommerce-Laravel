<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreWalletTransferRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->hasPermission('portefeuilles.create');
    }

    /**
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'date' => ['required', 'date'],
            'from_wallet_id' => ['required', 'integer', 'exists:wallets,id'],
            'to_wallet_id' => ['required', 'integer', 'exists:wallets,id', 'different:from_wallet_id'],
            'amount' => ['required', 'numeric', 'min:1'],
            'remark' => ['nullable', 'string', 'max:255'],
        ];
    }
}
