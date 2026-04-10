<?php

namespace App\Http\Controllers;

use App\Models\CorporateEvent;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CorporateCalendarController extends Controller
{
    public function index(Request $request)
    {
        // Get month and year from request or use current
        $month = $request->input('month', now()->month);
        $year = $request->input('year', now()->year);

        // Load all events for the requested month
        $startOfMonth = now()->setYear($year)->setMonth($month)->startOfMonth();
        $endOfMonth = now()->setYear($year)->setMonth($month)->endOfMonth();

        $events = CorporateEvent::published()
            ->whereBetween('event_date', [$startOfMonth, $endOfMonth])
            ->orderBy('event_date', 'asc')
            ->get();

        return Inertia::render('Calendar/Index', [
            'events' => [
                'data' => $events,
            ],
        ]);
    }
}
