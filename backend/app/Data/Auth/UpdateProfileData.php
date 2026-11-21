<?php

namespace App\Data\Auth;

use Illuminate\Http\UploadedFile;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Optional;

class UpdateProfileData extends Data
{
    public function __construct(
        public string $name,
        public string $email,
        public string|null|Optional $phone = new Optional(),
        public ?UploadedFile $avatar = null,
        public ?string $current_password = null,
        public ?string $password = null,
    ) {}

    public static function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => [
                'required',
                'email',
                'max:255',
                Rule::unique('users', 'email')->ignore(request()->user()->id),
            ],
            'phone' => ['nullable', 'string', 'max:30'],
            'avatar' => ['nullable', 'image', 'max:4096'],
            'current_password' => ['required_with:password', 'string', 'current_password'],
            'password' => ['nullable', 'string', Password::defaults(), 'confirmed'],
        ];
    }
}
