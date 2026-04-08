<?php

namespace App\Http\Controllers;

use App\Models\CorporateEvent;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CorporateCalendarController extends Controller
{
    public function index()
    {
        $events = CorporateEvent::published()
            ->upcoming()
            ->paginate(12);

        return Inertia::render('Calendar/Index', [
            'events' => $events,
        ]);
    }
}
