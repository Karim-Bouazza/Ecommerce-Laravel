<?php

namespace App\Http\Controllers\Api\Auth;

use App\Data\Auth\LoginData;
use App\Data\Auth\UpdateProfileData;
use App\Data\Auth\UserData;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class AuthController extends Controller
{
    public function login(LoginData $data, Request $request)
    {
        if (! Auth::attempt(['email' => $data->email, 'password' => $data->password, 'is_active' => true], $data->remember)) {
            return response()->json([
                'message' => 'Invalid credentials.',
            ], 401);
        }

        $request->session()->regenerate();

        return UserData::fromUser($request->user()->load('roles.permissions'));
    }

    public function logout(Request $request)
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->noContent();
    }

    public function me(Request $request)
    {
        return UserData::fromUser($request->user()->load('roles.permissions'));
    }

    public function updateProfile(UpdateProfileData $data, Request $request): UserData
    {
        $user = $request->user();
        $attributes = $data->only('name', 'email', 'phone')->toArray();

        if (filled($data->password)) {
            $attributes['password'] = $data->password;
        }

        if ($data->avatar !== null) {
            $previousAvatar = $user->avatar;
            $attributes['avatar'] = $data->avatar->store('avatars', 'public');

            if ($previousAvatar) {
                Storage::disk('public')->delete($previousAvatar);
            }
        }

        $user->update($attributes);

        return UserData::fromUser($user->fresh()->load('roles.permissions'));
    }
}
