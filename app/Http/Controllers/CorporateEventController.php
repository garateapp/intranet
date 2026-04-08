<?php

namespace App\Http\Controllers;

use App\Models\CorporateEvent;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CorporateEventController extends Controller
{
    public function index()
    {
        $events = CorporateEvent::orderBy('event_date', 'desc')
            ->paginate(15);

        return Inertia::render('CorporateEvents/Index', [
            'events' => $events,
        ]);
    }

    public function create()
    {
        return Inertia::render('CorporateEvents/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'event_date' => ['required', 'date'],
            'end_date' => ['nullable', 'date'],
            'location' => ['nullable', 'string', 'max:255'],
            'type' => ['nullable', 'string', 'max:255'],
            'color' => ['nullable', 'string', 'max:255'],
            'is_featured' => ['boolean'],
            'is_published' => ['boolean'],
        ]);

        CorporateEvent::create($validated);

        return redirect()->route('corporate-events.index')
            ->with('success', 'Evento corporativo creado exitosamente.');
    }

    public function edit(CorporateEvent $corporateEvent)
    {
        return Inertia::render('CorporateEvents/Edit', [
            'event' => $corporateEvent,
        ]);
    }

    public function update(Request $request, CorporateEvent $corporateEvent)
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'event_date' => ['required', 'date'],
            'end_date' => ['nullable', 'date'],
            'location' => ['nullable', 'string', 'max:255'],
            'type' => ['nullable', 'string', 'max:255'],
            'color' => ['nullable', 'string', 'max:255'],
            'is_featured' => ['boolean'],
            'is_published' => ['boolean'],
        ]);

        $corporateEvent->update($validated);

        return redirect()->route('corporate-events.index')
            ->with('success', 'Evento corporativo actualizado exitosamente.');
    }

    public function destroy(CorporateEvent $corporateEvent)
    {
        $corporateEvent->delete();

        return redirect()->route('corporate-events.index')
            ->with('success', 'Evento corporativo eliminado exitosamente.');
    }
}
