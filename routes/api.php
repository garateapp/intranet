<?php

use App\Http\Controllers\Api\UserActivityController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application.
| These routes are loaded by the RouteServiceProvider within a group
| which is assigned the "api" middleware group.
|
*/

Route::middleware(['auth:sanctum'])->group(function () {

    // User activity - own activity
    Route::get('/user-activities', [UserActivityController::class, 'index']);
    Route::get('/user-activities/stats', [UserActivityController::class, 'stats']);
    Route::get('/user-activities/export', [UserActivityController::class, 'export']);

    // Admin - all user activities
    Route::middleware('admin')->group(function () {
        Route::get('/admin/user-activities', [UserActivityController::class, 'adminIndex']);
        Route::get('/admin/user-activities/stats', [UserActivityController::class, 'adminStats']);
        Route::get('/admin/user-activities/export', [UserActivityController::class, 'adminExport']);
        Route::get('/admin/user-activities/{user}', [UserActivityController::class, 'adminUserDetail']);
    });
});
