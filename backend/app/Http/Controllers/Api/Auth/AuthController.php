<?php

namespace App\Http\Controllers\Api\Auth;

use App\Data\Auth\LoginData;
use App\Data\Auth\TokenLoginData;
use App\Data\Auth\UpdateProfileData;
use App\Data\Auth\UserData;
use App\Http\Controllers\Controller;
use App\Models\Users\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

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

    public function tokenLogin(TokenLoginData $data)
    {
        $user = User::where('email', $data->email)->first();

        if (! $user || ! $user->is_active || ! Hash::check($data->password, $user->password)) {
            return response()->json([
                'message' => 'Invalid credentials.',
            ], 401);
        }

        return response()->json([
            'token' => $user->createToken($data->device_name)->plainTextToken,
            'token_type' => 'Bearer',
            'user' => UserData::fromUser($user->load('roles.permissions')),
        ]);
    }

    public function tokenLogout(Request $request)
    {
        $request->user()->currentAccessToken()?->delete();

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

        $user->setImage($data->avatar, 'avatar');

        $user->update($attributes);

        return UserData::fromUser($user->fresh()->load('roles.permissions'));
    }
}
