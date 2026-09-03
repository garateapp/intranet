<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\SyncPurchaseInvoiceApprovalsRequest;
use App\Services\PurchaseInvoiceSyncService;
use Illuminate\Http\JsonResponse;

class SapPurchaseInvoiceApprovalSyncController extends Controller
{
    public function __invoke(
        SyncPurchaseInvoiceApprovalsRequest $request,
        PurchaseInvoiceSyncService $service,
    ): JsonResponse {
        return response()->json($service->sync($request->validated()));
    }
}
