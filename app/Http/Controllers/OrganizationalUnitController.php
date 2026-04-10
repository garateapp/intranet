<?php

namespace App\Http\Controllers;

use App\Models\OrganizationalUnit;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class OrganizationalUnitController extends Controller
{
    public function index()
    {
        $units = OrganizationalUnit::with(['parent', 'children'])
            ->orderBy('sort_order')
            ->get();

        return Inertia::render('OrganizationalUnits/Index', [
            'units' => $units,
        ]);
    }

    public function create()
    {
        $units = OrganizationalUnit::active()->orderBy('sort_order')->get();
        return Inertia::render('OrganizationalUnits/Create', [
            'units' => $units,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'parent_id' => ['nullable', 'exists:organizational_units,id'],
            'sort_order' => ['nullable', 'integer'],
            'is_active' => ['boolean'],
        ]);

        // Prevent cycles
        if ($validated['parent_id']) {
            $parent = OrganizationalUnit::find($validated['parent_id']);
            if ($parent && $parent->getDescendantsAndSelf()->pluck('id')->contains($validated['parent_id'] ?? 0)) {
                return back()->withErrors(['parent_id' => 'No se puede crear un ciclo en la jerarquía.']);
            }
        }

        $validated['slug'] = Str::slug($validated['name']);
        OrganizationalUnit::create($validated);

        return redirect()->route('organizational-units.index')
            ->with('success', 'Unidad organizacional creada exitosamente.');
    }

    public function edit(OrganizationalUnit $organizationalUnit)
    {
        $units = OrganizationalUnit::active()
            ->where('id', '!=', $organizationalUnit->id)
            ->orderBy('sort_order')
            ->get();
        return Inertia::render('OrganizationalUnits/Edit', [
            'unit' => $organizationalUnit,
            'units' => $units,
        ]);
    }

    public function update(Request $request, OrganizationalUnit $organizationalUnit)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'parent_id' => ['nullable', 'exists:organizational_units,id'],
            'sort_order' => ['nullable', 'integer'],
            'is_active' => ['boolean'],
        ]);

        // Prevent self-reference
        if ($validated['parent_id'] == $organizationalUnit->id) {
            $validated['parent_id'] = null;
        }

        if ($validated['name'] !== $organizationalUnit->name) {
            $validated['slug'] = Str::slug($validated['name']);
        }

        $organizationalUnit->update($validated);

        return redirect()->route('organizational-units.index')
            ->with('success', 'Unidad organizacional actualizada exitosamente.');
    }

    public function destroy(OrganizationalUnit $organizationalUnit)
    {
        $organizationalUnit->delete();

        return redirect()->route('organizational-units.index')
            ->with('success', 'Unidad organizacional eliminada exitosamente.');
    }

    public function assignMembers(OrganizationalUnit $organizationalUnit)
    {
        $unit = $organizationalUnit->load(['users', 'children']);

        // Get all users not in this unit
        $availableUsers = User::where(function($query) use ($organizationalUnit) {
            $query->where('organizational_unit_id', '!=', $organizationalUnit->id)
                  ->orWhereNull('organizational_unit_id');
        })
        ->orderBy('name')
        ->get(['id', 'name', 'email', 'department', 'position', 'organizational_unit_id']);

        // Get all units for potential transfers
        $allUnits = OrganizationalUnit::active()
            ->orderBy('name')
            ->get(['id', 'name']);

        return Inertia::render('OrganizationalUnits/AssignMembers', [
            'unit' => $unit,
            'availableUsers' => $availableUsers,
            'allUnits' => $allUnits,
        ]);
    }

    public function updateMembers(Request $request, OrganizationalUnit $organizationalUnit)
    {
        $validated = $request->validate([
            'user_ids' => ['required', 'array'],
            'user_ids.*' => ['exists:users,id'],
        ]);

        // Remove all users from this unit first
        User::where('organizational_unit_id', $organizationalUnit->id)
            ->update(['organizational_unit_id' => null]);

        // Assign selected users to this unit
        if (!empty($validated['user_ids'])) {
            User::whereIn('id', $validated['user_ids'])
                ->update(['organizational_unit_id' => $organizationalUnit->id]);
        }

        return redirect()->route('organizational-units.index')
            ->with('success', 'Miembros asignados exitosamente.');
    }

    public function bulkAssignMembers(Request $request)
    {
        $validated = $request->validate([
            'unit_id' => ['required', 'exists:organizational_units,id'],
            'user_ids' => ['required', 'array'],
            'user_ids.*' => ['exists:users,id'],
        ]);

        $unit = OrganizationalUnit::findOrFail($validated['unit_id']);

        // Remove users from this unit
        User::where('organizational_unit_id', $unit->id)
            ->update(['organizational_unit_id' => null]);

        // Assign selected users
        if (!empty($validated['user_ids'])) {
            User::whereIn('id', $validated['user_ids'])
                ->update(['organizational_unit_id' => $unit->id]);
        }

        return redirect()->route('organizational-units.index')
            ->with('success', 'Miembros asignados a ' . $unit->name . ' exitosamente.');
    }
}
