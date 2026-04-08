<?php

namespace App\Http\Controllers;

use App\Models\UserRequest;
use App\Models\RequestType;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class MyRequestsController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();
        $status = $request->input('status', '');
        $type = $request->input('type', '');

        $requestsQuery = UserRequest::with(['requestType', 'user'])
            ->forUser($user->id)
            ->latest();

        if (! empty($status)) {
            $requestsQuery->byStatus($status);
        }

        if (! empty($type)) {
            $requestsQuery->whereHas('requestType', function ($q) use ($type) {
                $q->where('slug', $type);
            });
        }

        $requests = $requestsQuery->paginate(15);

        $requestTypes = RequestType::active()->get();

        $stats = [
            'total' => UserRequest::forUser($user->id)->count(),
            'pendiente' => UserRequest::forUser($user->id)->byStatus('pendiente')->count(),
            'en_revision' => UserRequest::forUser($user->id)->byStatus('en_revision')->count(),
            'aprobada' => UserRequest::forUser($user->id)->byStatus('aprobada')->count(),
            'rechazada' => UserRequest::forUser($user->id)->byStatus('rechazada')->count(),
            'completada' => UserRequest::forUser($user->id)->byStatus('completada')->count(),
        ];

        return Inertia::render('MyRequests/Index', [
            'requests' => $requests,
            'requestTypes' => $requestTypes,
            'stats' => $stats,
            'filters' => [
                'status' => $status,
                'type' => $type,
            ],
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'request_type_id' => ['nullable', 'exists:request_types,id'],
            'title' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
        ]);

        $userRequest = UserRequest::create([
            'user_id' => Auth::id(),
            'request_type_id' => $validated['request_type_id'] ?: null,
            'title' => $validated['title'],
            'description' => $validated['description'],
            'reference_code' => UserRequest::generateReferenceCode(),
            'created_by' => Auth::id(),
        ]);

        return redirect()->back()->with('success', 'Solicitud creada exitosamente.');
    }
}
