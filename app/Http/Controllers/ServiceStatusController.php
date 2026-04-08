<?php

namespace App\Http\Controllers;

use App\Models\Service;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ServiceStatusController extends Controller
{
    public function index()
    {
        $services = Service::active()
            ->public()
            ->with(['statusHistory' => function ($query) {
                $query->latest()->limit(5)->with('changedBy');
            }])
            ->get();

        $operativos = $services->where('status', 'operativo')->count();
        $total = $services->count();

        return Inertia::render('ServiceStatus/Index', [
            'services' => $services,
            'summary' => [
                'total' => $total,
                'operativos' => $operativos,
                'with_issues' => $total - $operativos,
            ],
        ]);
    }
}
