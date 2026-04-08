<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class UserDirectoryAdminController extends Controller
{
    public function index(Request $request)
    {
        $query = $request->input('q', '');
        $role = $request->input('role', '');

        $usersQuery = User::query();

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
        return Inertia::render('Users/Edit', [
            'user' => $user,
        ]);
    }

    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', Rule::unique('users')->ignore($user->id)],
            'department' => ['nullable', 'string', 'max:255'],
            'position' => ['nullable', 'string', 'max:255'],
            'phone' => ['nullable', 'string', 'max:255'],
            'location' => ['nullable', 'string', 'max:255'],
            'bio' => ['nullable', 'string'],
            'is_directory_visible' => ['boolean'],
            'is_directory_featured' => ['boolean'],
        ]);

        $user->update($validated);

        return redirect()->route('users.index')
            ->with('success', 'Usuario actualizado exitosamente.');
    }
}
