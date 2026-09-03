<?php

use App\Http\Controllers\Api\SapPurchaseInvoiceApprovalSyncController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

Route::post('/sap/oc-approvals/sync', SapPurchaseInvoiceApprovalSyncController::class)
    ->middleware('auth:sanctum')
    ->name('api.sap.oc-approvals.sync');
