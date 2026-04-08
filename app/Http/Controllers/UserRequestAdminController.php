<?php

namespace App\Http\Controllers;

use App\Models\UserRequest;
use App\Models\RequestType;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserRequestAdminController extends Controller
{
    public function index(Request $request)
    {
        $status = $request->input('status', '');
        $type = $request->input('type', '');

        $requestsQuery = UserRequest::with(['user', 'requestType'])
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

        return Inertia::render('AdminUserRequests/Index', [
            'requests' => $requests,
            'requestTypes' => $requestTypes,
            'filters' => [
                'status' => $status,
                'type' => $type,
            ],
        ]);
    }

    public function show(UserRequest $userRequest)
    {
        return Inertia::render('AdminUserRequests/Show', [
            'request' => $userRequest->load(['user', 'requestType']),
        ]);
    }

    public function updateStatus(Request $request, UserRequest $userRequest)
    {
        $validated = $request->validate([
            'status' => ['required', 'string', 'in:pendiente,en_revision,aprobada,rechazada,completada'],
            'admin_notes' => ['nullable', 'string'],
        ]);

        $userRequest->updateStatus($validated['status'], $validated['admin_notes'] ?? null);

        return redirect()->back()
            ->with('success', 'Estado de solicitud actualizado.');
    }
}
