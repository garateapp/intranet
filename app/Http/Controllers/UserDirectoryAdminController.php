<?php

namespace App\Http\Controllers;

use App\Models\OrganizationalUnit;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class UserDirectoryAdminController extends Controller
{
    public function index(Request $request)
    {
        $query = $request->input('q', '');
        $role = $request->input('role', '');

        $usersQuery = User::query()->with('manager');

        if (!empty($query)) {
            $usersQuery->where(function ($q) use ($query) {
                $q->where('name', 'like', "%{$query}%")
                  ->orWhere('email', 'like', "%{$query}%");
            });
        }

        if (!empty($role)) {
            $usersQuery->where('role', $role);
        }

        $users = $usersQuery->orderBy('name')->paginate(15);

        return Inertia::render('Users/Index', [
            'users' => $users,
            'filters' => [
                'q' => $query,
                'role' => $role,
            ],
        ]);
    }

    public function edit(User $user)
    {
        $user->load('manager');

        return Inertia::render('Users/Edit', [
            'user' => $user,
            'managers' => User::orderBy('name')->get(['id', 'name', 'email']),
            'organizationalUnits' => OrganizationalUnit::active()->orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', Rule::unique('users')->ignore($user->id)],
            'role' => ['required', 'in:admin,user'],
            'department' => ['nullable', 'string', 'max:255'],
            'position' => ['nullable', 'string', 'max:255'],
            'phone' => ['nullable', 'string', 'max:255'],
            'location' => ['nullable', 'string', 'max:255'],
            'bio' => ['nullable', 'string'],
            'manager_id' => ['nullable', 'exists:users,id'],
            'organizational_unit_id' => ['nullable', 'exists:organizational_units,id'],
            'is_directory_visible' => ['boolean'],
            'is_directory_featured' => ['boolean'],
            'avatar' => ['nullable', 'image', 'max:2048'],
        ]);

        // Handle avatar upload
        if ($request->hasFile('avatar')) {
            if ($user->avatar && !str_contains($user->avatar, '://')) {
                Storage::disk('public')->delete($user->avatar);
            }
            $path = $request->file('avatar')->store('avatars', 'public');
            $validated['avatar'] = $path;
        }

        $user->update($validated);

        return redirect()->route('users.index')
            ->with('success', 'Usuario actualizado exitosamente.');
    }
}
