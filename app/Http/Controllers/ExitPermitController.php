<?php

namespace App\Http\Controllers;

use App\Mail\ExitPermitCreated;
use App\Models\ExitPermit;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;

class ExitPermitController extends Controller
{
    public function create()
    {
        $user = Auth::user();
        $manager = null;
        if ($user->manager_id) {
            $manager = User::find($user->manager_id);
        }

        return Inertia::render('ExitPermits/Create', [
            'manager' => $manager,
        ]);
    }

    public function store(Request $request)
    {
        $user = Auth::user();

        $validated = $request->validate([
            'fecha_salida' => ['required', 'date'],
            'hora_salida' => ['nullable', 'string'],
            'fecha_retorno' => ['nullable', 'date', 'after_or_equal:fecha_salida'],
            'hora_retorno' => ['nullable', 'string'],
            'motivo' => ['required', 'string', 'max:5000'],
            'observaciones' => ['nullable', 'string', 'max:5000'],
        ]);

        $exitPermit = ExitPermit::create([
            'user_id' => $user->id,
            'manager_id' => $user->manager_id,
            'fecha_salida' => $validated['fecha_salida'],
            'hora_salida' => $validated['hora_salida'],
            'fecha_retorno' => $validated['fecha_retorno'],
            'hora_retorno' => $validated['hora_retorno'],
            'motivo' => $validated['motivo'],
            'observaciones' => $validated['observaciones'],
            'status' => 'pendiente',
            'created_by' => $user->id,
        ]);

        $this->sendNotifications($exitPermit);

        return redirect()->route('exit-permits.index')
            ->with('success', 'Permiso de salida solicitado exitosamente.');
    }

    public function index(Request $request)
    {
        $user = Auth::user();
        $status = $request->input('status', '');

        $permitsQuery = ExitPermit::with(['user', 'manager'])
            ->forUser($user->id)
            ->latest();

        if (! empty($status)) {
            $permitsQuery->byStatus($status);
        }

        $permits = $permitsQuery->paginate(15);

        $stats = [
            'total' => ExitPermit::forUser($user->id)->count(),
            'pendiente' => ExitPermit::forUser($user->id)->byStatus('pendiente')->count(),
            'aprobada' => ExitPermit::forUser($user->id)->byStatus('aprobada')->count(),
            'rechazada' => ExitPermit::forUser($user->id)->byStatus('rechazada')->count(),
        ];

        return Inertia::render('ExitPermits/Index', [
            'permits' => $permits,
            'stats' => $stats,
            'filters' => [
                'status' => $status,
            ],
        ]);
    }

    protected function sendNotifications(ExitPermit $exitPermit)
    {
        // Send email only to the direct boss with the approval link
        if ($exitPermit->manager && $exitPermit->manager->email) {
            Mail::to($exitPermit->manager->email)
                ->queue(new ExitPermitCreated($exitPermit));
        }
    }
}
