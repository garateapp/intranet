<?php

namespace App\Http\Controllers;

use App\Models\OrganizationalUnit;
use App\Models\User;
use App\Services\UserImporter;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class UserDirectoryAdminController extends Controller
{
    private const ROLES = ['admin', 'user', 'recruiter', 'hiring_manager'];

    public function index(Request $request)
    {
        $query = $request->input('q', '');
        $role = $request->input('role', '');

        $usersQuery = User::query()->with('manager');

        if (! empty($query)) {
            $usersQuery->where(function ($q) use ($query) {
                $q->where('name', 'like', "%{$query}%")
                    ->orWhere('email', 'like', "%{$query}%");
            });
        }

        if (! empty($role)) {
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

    public function create()
    {
        return Inertia::render('Users/Create', [
            'managers' => User::orderBy('name')->get(['id', 'name', 'email']),
            'organizationalUnits' => OrganizationalUnit::active()->orderBy('name')->get(['id', 'name']),
            'roles' => self::ROLES,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'first_name' => ['required', 'string', 'max:255'],
            'last_name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', Rule::unique('users', 'email')],
            'role' => ['required', Rule::in(self::ROLES)],
            'department' => ['nullable', 'string', 'max:255'],
            'position' => ['nullable', 'string', 'max:255'],
            'phone' => ['nullable', 'string', 'max:255'],
            'location' => ['nullable', 'string', 'max:255'],
            'manager_id' => ['nullable', 'exists:users,id'],
            'organizational_unit_id' => ['nullable', 'exists:organizational_units,id'],
            'is_directory_visible' => ['boolean'],
            'password' => ['nullable', 'string', 'min:6'],
        ], [
            'first_name.required' => 'El nombre es obligatorio.',
            'last_name.required' => 'El apellido es obligatorio.',
            'email.unique' => 'Ese email ya está registrado.',
        ]);

        $password = ($validated['password'] ?? '') !== ''
            ? $validated['password']
            : UserImporter::generatePassword($validated['first_name'], $validated['last_name']);

        foreach (['department', 'position', 'phone', 'location', 'manager_id', 'organizational_unit_id'] as $field) {
            $validated[$field] = ($validated[$field] ?? '') !== '' ? $validated[$field] : null;
        }

        $user = User::create([
            'name' => trim($validated['first_name'].' '.$validated['last_name']),
            'email' => $validated['email'],
            'password' => $password,
            'role' => $validated['role'],
            'department' => $validated['department'],
            'position' => $validated['position'],
            'phone' => $validated['phone'],
            'location' => $validated['location'],
            'manager_id' => $validated['manager_id'],
            'organizational_unit_id' => $validated['organizational_unit_id'],
            'is_directory_visible' => $validated['is_directory_visible'] ?? true,
            'is_directory_featured' => false,
        ]);

        return redirect()->route('users.index')->with('success', "Usuario {$user->name} creado. Contraseña: {$password}");
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
            'role' => ['required', 'in:admin,user,super_admin,recruiter,hiring_manager'],
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
            if ($user->avatar && ! str_contains($user->avatar, '://')) {
                Storage::disk('public')->delete($user->avatar);
            }
            $path = $request->file('avatar')->store('avatars', 'public');
            $validated['avatar'] = $path;
        }

        $user->update($validated);

        return redirect()->route('users.index')
            ->with('success', 'Usuario actualizado exitosamente.');
    }

    /**
     * Descarga la plantilla de ejemplo para la carga masiva de usuarios.
     */
    public function template()
    {
        $tempFile = app(UserImporter::class)->generateTemplate();

        return response()->download($tempFile, 'plantilla_usuarios.xlsx', [
            'Content-Type' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        ])->deleteFileAfterSend(true);
    }

    /**
     * Página de carga masiva de usuarios.
     */
    public function import()
    {
        return Inertia::render('Users/Import', [
            'result' => null,
        ]);
    }

    /**
     * Procesa el archivo de carga masiva y crea los usuarios.
     */
    public function processImport(Request $request)
    {
        $request->validate([
            'file' => ['required', 'file', 'extensions:xlsx,csv', 'max:10240'],
        ], [
            'file.required' => 'Debe seleccionar un archivo.',
            'file.extensions' => 'El archivo debe ser .xlsx o .csv.',
            'file.max' => 'El archivo no debe superar los 10 MB.',
        ]);

        try {
            $result = app(UserImporter::class)->import($request->file('file'));
        } catch (\Throwable $e) {
            $result = [
                'total_rows' => 0,
                'created' => 0,
                'credentials' => [],
                'errors' => [['row' => 0, 'error' => $e->getMessage()]],
            ];
        }

        return Inertia::render('Users/Import', [
            'result' => $result,
        ]);
    }
}
