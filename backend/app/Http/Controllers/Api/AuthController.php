<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\UpdateProfileRequest;
use App\Http\Resources\UserResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class AuthController extends Controller
{
    public function login(LoginRequest $request)
    {
        if (! Auth::attempt($request->only('email', 'password'), $request->boolean('remember'))) {
            return response()->json([
                'message' => 'Invalid credentials.',
            ], 401);
        }

        $request->session()->regenerate();

        return new UserResource($request->user()->load('role'));
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
        return new UserResource($request->user()->load('role'));
    }

    public function updateProfile(UpdateProfileRequest $request): UserResource
    {
        $user = $request->user();
        $data = $request->safe()->only(['name', 'email', 'phone']);

        if ($request->filled('password')) {
            $data['password'] = $request->validated('password');
        }

        if ($request->hasFile('avatar')) {
            $previousAvatar = $user->avatar;
            $data['avatar'] = $request->file('avatar')->store('avatars', 'public');

            if ($previousAvatar) {
                Storage::disk('public')->delete($previousAvatar);
            }
        }

        $user->update($data);

        return new UserResource($user->fresh()->load('role'));
    }
}
