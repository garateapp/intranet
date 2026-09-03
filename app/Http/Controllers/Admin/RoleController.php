<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\Models\Role;

class RoleController extends Controller
{
    public function index(Request $request): Response
    {
        abort_unless($request->user()->hasRole('super_admin'), 403);
        $search = trim($request->string('buscar')->toString());

        $users = User::query()
            ->with('roles')
            ->when($search, fn ($q) => $q->where(function ($q) use ($search): void {
                $q->where('name', 'like', "%{$search}%")->orWhere('email', 'like', "%{$search}%");
            }))
            ->orderBy('name')
            ->paginate(20)
            ->withQueryString()
            ->through(fn (User $user): array => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'roles' => $user->roles->pluck('name')->values(),
            ]);

        $availableRoles = Role::query()->orderBy('name')->get(['name'])->pluck('name');

        return Inertia::render('Admin/Roles', [
            'users' => $users,
            'availableRoles' => $availableRoles,
            'filters' => ['buscar' => $search],
        ]);
    }

    public function update(Request $request, User $user): RedirectResponse
    {
        abort_unless($request->user()->hasRole('super_admin'), 403);

        $validated = $request->validate([
            'roles' => ['array'],
            'roles.*' => ['string', Rule::in(Role::query()->pluck('name')->all())],
        ]);

        $user->syncRoles($validated['roles'] ?? []);

        return back()->with('success', "Roles de {$user->name} actualizados.");
    }
}
