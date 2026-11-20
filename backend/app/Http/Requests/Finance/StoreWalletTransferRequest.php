<?php

namespace App\Http\Requests\Finance;

use Illuminate\Foundation\Http\FormRequest;

class StoreWalletTransferRequest extends FormRequest
{
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
