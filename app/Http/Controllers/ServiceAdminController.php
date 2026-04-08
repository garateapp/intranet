<?php

namespace App\Http\Controllers;

use App\Models\Service;
use App\Models\ServiceStatusHistory;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class ServiceAdminController extends Controller
{
    public function index()
    {
        $services = Service::withCount('statusHistory')
            ->orderBy('sort_order')
            ->get();

        return Inertia::render('Services/Index', [
            'services' => $services,
        ]);
    }

    public function create()
    {
        return Inertia::render('Services/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'status' => ['required', 'string', 'in:operativo,degradado,incidente,mantenimiento'],
            'status_message' => ['nullable', 'string'],
            'sort_order' => ['nullable', 'integer'],
            'is_active' => ['boolean'],
            'is_public' => ['boolean'],
        ]);

        $validated['slug'] = Str::slug($validated['name']);
        $validated['last_checked_at'] = now();
        Service::create($validated);

        return redirect()->route('services.index')
            ->with('success', 'Servicio creado exitosamente.');
    }

    public function edit(Service $service)
    {
        return Inertia::render('Services/Edit', [
            'service' => $service,
        ]);
    }

    public function update(Request $request, Service $service)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'status' => ['required', 'string', 'in:operativo,degradado,incidente,mantenimiento'],
            'status_message' => ['nullable', 'string'],
            'sort_order' => ['nullable', 'integer'],
            'is_active' => ['boolean'],
            'is_public' => ['boolean'],
        ]);

        if ($validated['name'] !== $service->name) {
            $validated['slug'] = Str::slug($validated['name']);
        }

        $service->update($validated);

        return redirect()->route('services.index')
            ->with('success', 'Servicio actualizado exitosamente.');
    }

    public function updateStatus(Request $request, Service $service)
    {
        $validated = $request->validate([
            'status' => ['required', 'string', 'in:operativo,degradado,incidente,mantenimiento'],
            'status_message' => ['nullable', 'string'],
        ]);

        $service->updateStatus($validated['status'], $validated['status_message'] ?? null);

        return redirect()->route('services.index')
            ->with('success', 'Estado del servicio actualizado.');
    }

    public function destroy(Service $service)
    {
        $service->delete();

        return redirect()->route('services.index')
            ->with('success', 'Servicio eliminado exitosamente.');
    }

    public function history(Service $service)
    {
        $history = ServiceStatusHistory::with('changedBy')
            ->where('service_id', $service->id)
            ->latest()
            ->paginate(20);

        return Inertia::render('Services/History', [
            'service' => $service,
            'history' => $history,
        ]);
    }
}
