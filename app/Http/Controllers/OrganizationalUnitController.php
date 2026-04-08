<?php

namespace App\Http\Controllers;

use App\Models\OrganizationalUnit;
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
}
