<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\LinkController;
use App\Http\Controllers\SettingController;
use App\Http\Controllers\GoogleAuthController;
use App\Http\Controllers\SearchController;
use App\Http\Controllers\PeopleDirectoryController;
use App\Http\Controllers\FaqPortalController;
use App\Http\Controllers\CorporateCalendarController;
use App\Http\Controllers\HrPortalController;
use App\Http\Controllers\UserDirectoryAdminController;
use App\Http\Controllers\FaqCategoryController;
use App\Http\Controllers\FaqController;
use App\Http\Controllers\CorporateEventController;
use App\Http\Controllers\OrganigramController;
use App\Http\Controllers\AdminOrganigramController;
use App\Http\Controllers\OnboardingController;
use App\Http\Controllers\DocumentLibraryController;
use App\Http\Controllers\ServiceStatusController;
use App\Http\Controllers\MyRequestsController;
use App\Http\Controllers\OrganizationalUnitController;
use App\Http\Controllers\OnboardingStageAdminController;
use App\Http\Controllers\OnboardingTaskAdminController;
use App\Http\Controllers\DocumentController;
use App\Http\Controllers\ServiceAdminController;
use App\Http\Controllers\RequestTypeController;
use App\Http\Controllers\UserRequestAdminController;
use App\Http\Controllers\AuditLogController;
use App\Http\Controllers\UserActivityController as UserActivityWebController;
use App\Http\Controllers\SurveyController;
use App\Http\Controllers\SurveyResponseController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Public routes
Route::get('/', [DashboardController::class, 'welcome'])->name('welcome');
Route::get('/noticia/{post:slug}', [PostController::class, 'show'])->name('public.posts.show');
Route::post('/encuestas/{survey}/responder', [SurveyResponseController::class, 'store'])->name('surveys.respond');

// Google OAuth routes
Route::get('/auth/google', [GoogleAuthController::class, 'redirectToGoogle'])->name('auth.google');
Route::get('/auth/google/callback', [GoogleAuthController::class, 'handleGoogleCallback']);

// Authenticated routes
Route::middleware(['auth', 'verified'])->group(function () {
    // Dashboard
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Portal pages
    Route::get('/search', [SearchController::class, 'index'])->name('search.index');
    Route::get('/directory', [PeopleDirectoryController::class, 'index'])->name('directory.index');
    Route::get('/faq', [FaqPortalController::class, 'index'])->name('faq.index');
    Route::get('/calendar', [CorporateCalendarController::class, 'index'])->name('calendar.index');
    Route::get('/rrhh', [HrPortalController::class, 'index'])->name('rrhh.index');
    Route::get('/rrhh/redirect', [HrPortalController::class, 'redirect'])->name('rrhh.redirect');

    // Phase 2: Portal pages
    Route::get('/organigrama', [OrganigramController::class, 'index'])->name('organigram.index');
    Route::get('/onboarding', [OnboardingController::class, 'index'])->name('onboarding.index');
    Route::post('/onboarding/tasks/{task}/complete', [OnboardingController::class, 'completeTask'])->name('onboarding.complete-task');
    Route::get('/documentos', [DocumentLibraryController::class, 'index'])->name('documents.index');
    Route::get('/documentos/{document:slug}', [DocumentLibraryController::class, 'show'])->name('documents.show');
    Route::get('/servicios', [ServiceStatusController::class, 'index'])->name('services.index');
    Route::get('/mis-solicitudes', [MyRequestsController::class, 'index'])->name('my-requests.index');
    Route::post('/mis-solicitudes', [MyRequestsController::class, 'store'])->name('my-requests.store');

    // Profile
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Logout
    Route::post('/logout', [GoogleAuthController::class, 'logout'])->name('logout');

    // Admin-only resource routes
    Route::middleware(['admin'])->group(function () {
        Route::resource('posts', PostController::class)->except(['show'])->names('admin.posts');
        Route::resource('categories', CategoryController::class);
        Route::resource('links', LinkController::class);
        Route::resource('settings', SettingController::class)->except(['show']);

        // Portal admin routes
        Route::resource('users', UserDirectoryAdminController::class)->only(['index', 'edit', 'update']);
        Route::resource('faq-categories', FaqCategoryController::class);
        Route::resource('faqs', FaqController::class);
        Route::resource('corporate-events', CorporateEventController::class);

        // Phase 2: Portal admin routes
        Route::resource('organizational-units', OrganizationalUnitController::class);
        Route::get('admin/organigram', [AdminOrganigramController::class, 'index'])->name('admin.organigram.index');
        Route::post('admin/organigram', [AdminOrganigramController::class, 'store'])->name('admin.organigram.store');
        Route::get('organizational-units/{organizationalUnit}/assign-members', [OrganizationalUnitController::class, 'assignMembers'])
            ->name('organizational-units.assign-members');
        Route::post('organizational-units/{organizationalUnit}/update-members', [OrganizationalUnitController::class, 'updateMembers'])
            ->name('organizational-units.update-members');
        Route::post('organizational-units/bulk-assign-members', [OrganizationalUnitController::class, 'bulkAssignMembers'])
            ->name('organizational-units.bulk-assign-members');
        Route::resource('onboarding-stages', OnboardingStageAdminController::class);
        Route::resource('onboarding-tasks', OnboardingTaskAdminController::class);

        // Admin documents (separate namespace from user-facing)
        Route::resource('admin/documents', DocumentController::class)->names('admin.documents');
        Route::put('admin/documents/{document}/restore', [DocumentController::class, 'restore'])->name('admin.documents.restore');
        Route::post('admin/documents/{document}/upload', [DocumentController::class, 'upload'])->name('admin.documents.upload');
        Route::resource('admin/services', ServiceAdminController::class)->names('admin.services');
        Route::patch('admin/services/{service}/status', [ServiceAdminController::class, 'updateStatus'])->name('admin.services.update-status');
        Route::get('admin/services/{service}/history', [ServiceAdminController::class, 'history'])->name('admin.services.history');

        Route::resource('request-types', RequestTypeController::class);
        Route::resource('surveys', SurveyController::class);
        Route::resource('user-requests', UserRequestAdminController::class)->only(['index', 'show', 'edit', 'update']);
        Route::patch('user-requests/{user_request}/status', [UserRequestAdminController::class, 'updateStatus'])->name('user-requests.update-status');
        Route::get('audit-logs', [AuditLogController::class, 'index'])->name('audit-logs.index');
        Route::get('user-activities', [UserActivityWebController::class, 'index'])->name('user-activities.index');

        // Activity API endpoints (JSON responses, same session auth)
        Route::get('api/user-activities', [\App\Http\Controllers\Api\UserActivityController::class, 'index']);
        Route::get('api/user-activities/stats', [\App\Http\Controllers\Api\UserActivityController::class, 'stats']);
        Route::get('api/user-activities/export', [\App\Http\Controllers\Api\UserActivityController::class, 'export']);
        Route::get('api/admin/user-activities', [\App\Http\Controllers\Api\UserActivityController::class, 'adminIndex']);
        Route::get('api/admin/user-activities/stats', [\App\Http\Controllers\Api\UserActivityController::class, 'adminStats']);
        Route::get('api/admin/user-activities/export', [\App\Http\Controllers\Api\UserActivityController::class, 'adminExport']);
        Route::get('api/admin/user-activities/{user}', [\App\Http\Controllers\Api\UserActivityController::class, 'adminUserDetail']);
    });
});

require __DIR__.'/auth.php';
