<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Laravel\Socialite\Facades\Socialite;
use Illuminate\Support\Str;

class GoogleAuthController extends Controller
{
    /**
     * Redirect to Google authentication.
     */
    public function redirectToGoogle()
    {
        return Socialite::driver('google')->redirect();
    }

    /**
     * Handle Google authentication callback.
     */
    public function handleGoogleCallback()
    {
        try {
            $googleUser = Socialite::driver('google')->user();
            $user = $this->findOrCreateUser($googleUser);

            Auth::login($user, true);

            return redirect()->intended(route('dashboard', absolute: false));
        } catch (\Exception $e) {
            return redirect()->route('login')->withErrors([
                'email' => 'Google authentication failed. Please try again.',
            ]);
        }
    }

    /**
     * Find existing user or create a new one.
     */
    protected function findOrCreateUser($googleUser)
    {
        $user = User::where('google_id', $googleUser->id)->first();

        if ($user) {
            return $user;
        }

        $user = User::where('email', $googleUser->email)->first();

        if ($user) {
            $user->update([
                'google_id' => $googleUser->id,
                'google_token' => $googleUser->token,
                'google_refresh_token' => $googleUser->refreshToken,
                'login_method' => 'google',
            ]);

            return $user;
        }

        return User::create([
            'name' => $googleUser->name,
            'email' => $googleUser->email,
            'google_id' => $googleUser->id,
            'google_token' => $googleUser->token,
            'google_refresh_token' => $googleUser->refreshToken,
            'login_method' => 'google',
            'password' => bcrypt(Str::random(16)),
            'email_verified_at' => now(),
        ]);
    }

    /**
     * Logout user.
     */
    public function logout(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('login');
    }
}
