<?php

namespace App\Http\Controllers;

use App\Models\RequestType;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class RequestTypeController extends Controller
{
    public function index()
    {
        $types = RequestType::withCount('requests')
            ->orderBy('sort_order')
            ->get();

        return Inertia::render('RequestTypes/Index', [
            'types' => $types,
        ]);
    }

    public function create()
    {
        return Inertia::render('RequestTypes/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'is_active' => ['boolean'],
            'sort_order' => ['nullable', 'integer'],
        ]);

        $validated['slug'] = Str::slug($validated['name']);
        RequestType::create($validated);

        return redirect()->route('request-types.index')
            ->with('success', 'Tipo de solicitud creado exitosamente.');
    }

    public function edit(RequestType $requestType)
    {
        return Inertia::render('RequestTypes/Edit', [
            'type' => $requestType,
        ]);
    }

    public function update(Request $request, RequestType $requestType)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'is_active' => ['boolean'],
            'sort_order' => ['nullable', 'integer'],
        ]);

        if ($validated['name'] !== $requestType->name) {
            $validated['slug'] = Str::slug($validated['name']);
        }

        $requestType->update($validated);

        return redirect()->route('request-types.index')
            ->with('success', 'Tipo de solicitud actualizado exitosamente.');
    }

    public function destroy(RequestType $requestType)
    {
        $requestType->delete();

        return redirect()->route('request-types.index')
            ->with('success', 'Tipo de solicitud eliminado exitosamente.');
    }
}
