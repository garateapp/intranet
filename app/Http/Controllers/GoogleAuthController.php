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

            // Debug: Log the Google user data
            \Log::info('Google User Data:', [
                'id' => $googleUser->id,
                'email' => $googleUser->email,
                'name' => $googleUser->name,
            ]);

            $user = $this->findOrCreateUser($googleUser);

            Auth::login($user, true);

            \Log::info('User logged in successfully:', [
                'user_id' => $user->id,
                'email' => $user->email,
            ]);

            return redirect()->intended(route('dashboard'));
        } catch (\Exception $e) {
            \Log::error('Google authentication failed:', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return redirect()->route('login')
                ->withErrors([
                    'email' => 'Google authentication failed: ' . $e->getMessage(),
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
