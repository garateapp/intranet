<?php

use App\Http\Controllers\Admin\PurchaseInvoiceObjectionReasonController;
use App\Http\Controllers\Admin\RoleController;
use App\Http\Controllers\Admin\SapOwnerUserController;
use App\Http\Controllers\AdminExitPermitController;
use App\Http\Controllers\AdminOrganigramController;
use App\Http\Controllers\Api\UserActivityController;
use App\Http\Controllers\ApplicationController;
use App\Http\Controllers\AtsDashboardController;
use App\Http\Controllers\AuditLogController;
use App\Http\Controllers\CandidateController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\CorporateCalendarController;
use App\Http\Controllers\CorporateEventController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\DocumentController;
use App\Http\Controllers\DocumentLibraryController;
use App\Http\Controllers\EvaluationController;
use App\Http\Controllers\ExitPermitController;
use App\Http\Controllers\FaqCategoryController;
use App\Http\Controllers\FaqController;
use App\Http\Controllers\FaqPortalController;
use App\Http\Controllers\FirmaController;
use App\Http\Controllers\GoogleAuthController;
use App\Http\Controllers\HrPortalController;
use App\Http\Controllers\InterviewController;
use App\Http\Controllers\LinkController;
use App\Http\Controllers\ManagerExitPermitController;
use App\Http\Controllers\MyRequestsController;
use App\Http\Controllers\OnboardingController;
use App\Http\Controllers\OnboardingStageAdminController;
use App\Http\Controllers\OnboardingTaskAdminController;
use App\Http\Controllers\OrganigramController;
use App\Http\Controllers\OrganizationalUnitController;
use App\Http\Controllers\PeopleDirectoryController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\PurchaseInvoiceAccountingController;
use App\Http\Controllers\PurchaseInvoiceApprovalController;
use App\Http\Controllers\PurchaseInvoiceReminderController;
use App\Http\Controllers\PurchaseInvoiceUnassignedController;
use App\Http\Controllers\RequestTypeController;
use App\Http\Controllers\SearchController;
use App\Http\Controllers\ServiceAdminController;
use App\Http\Controllers\ServiceStatusController;
use App\Http\Controllers\SettingController;
use App\Http\Controllers\StageController;
use App\Http\Controllers\SurveyController;
use App\Http\Controllers\SurveyResponseController;
use App\Http\Controllers\UserActivityController as UserActivityWebController;
use App\Http\Controllers\UserDirectoryAdminController;
use App\Http\Controllers\UserRequestAdminController;
use App\Http\Controllers\VacancyController;
use App\Http\Controllers\VacancyStageController;
use Illuminate\Support\Facades\Route;

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

    // Exit Permits
    Route::get('/permisos-salida', [ExitPermitController::class, 'index'])->name('exit-permits.index');
    Route::get('/permisos-salida/solicitar', [ExitPermitController::class, 'create'])->name('exit-permits.create');
    Route::post('/permisos-salida', [ExitPermitController::class, 'store'])->name('exit-permits.store');

    // Manager approval routes
    Route::get('/permisos-salida/aprobaciones', [ManagerExitPermitController::class, 'index'])->name('manager.exit-permits.index');
    Route::get('/permisos-salida/aprobaciones/descargar', [ManagerExitPermitController::class, 'downloadCsv'])->name('manager.exit-permits.download-csv');
    Route::get('/permisos-salida/aprobaciones/{exit_permit}', [ManagerExitPermitController::class, 'show'])->name('manager.exit-permits.show');
    Route::patch('/permisos-salida/aprobaciones/{exit_permit}/visar', [ManagerExitPermitController::class, 'visar'])->name('manager.exit-permits.visar');

    // Firma de correo
    Route::get('/firma', [FirmaController::class, 'index'])->name('firma.index');
    Route::post('/firma', [FirmaController::class, 'generate'])->name('firma.generate');

    // Profile
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Logout
    Route::post('/logout', [GoogleAuthController::class, 'logout'])->name('logout');

    Route::get('/aprobacion-facturas', [PurchaseInvoiceApprovalController::class, 'index'])->name('purchase-invoice-approvals.index');
    Route::get('/aprobacion-facturas/{purchase_invoice_approval}', [PurchaseInvoiceApprovalController::class, 'show'])->name('purchase-invoice-approvals.show');
    Route::post('/aprobacion-facturas/{purchase_invoice_approval}/aprobar', [PurchaseInvoiceApprovalController::class, 'approve'])->name('purchase-invoice-approvals.approve');
    Route::post('/aprobacion-facturas/{purchase_invoice_approval}/objetar', [PurchaseInvoiceApprovalController::class, 'object'])->name('purchase-invoice-approvals.object');
    Route::get('/contabilidad/aprobacion-facturas', PurchaseInvoiceAccountingController::class)->name('purchase-invoice-approvals.accounting');
    Route::get('/aprobacion-facturas-sin-asignar', [PurchaseInvoiceUnassignedController::class, 'index'])->name('purchase-invoice-approvals.unassigned');
    Route::post('/aprobacion-facturas/{purchase_invoice_approval}/asignar-responsable', [PurchaseInvoiceUnassignedController::class, 'assignResponsible'])->name('purchase-invoice-approvals.assign-responsible');
    Route::post('/aprobacion-facturas/{purchase_invoice_approval}/asignar-oc', [PurchaseInvoiceUnassignedController::class, 'assignPurchaseOrder'])->name('purchase-invoice-approvals.assign-po');
    Route::post('/aprobacion-facturas/{purchase_invoice_approval}/reconciliar-oc', [PurchaseInvoiceUnassignedController::class, 'reconcile'])->name('purchase-invoice-approvals.reconcile-po');
    Route::post('/aprobacion-facturas/{purchase_invoice_approval}/asignar-suplente', [PurchaseInvoiceUnassignedController::class, 'assignSubstitute'])->name('purchase-invoice-approvals.assign-substitute');
    Route::get('/aprobacion-facturas/{purchase_invoice_approval}/adjuntos/{attachment}/descargar', [PurchaseInvoiceApprovalController::class, 'downloadAttachment'])->name('purchase-invoice-approvals.download-attachment');
    Route::post('/contabilidad/facturas/enviar-recordatorio', [PurchaseInvoiceReminderController::class, 'sendReminder'])->name('purchase-invoice-approvals.send-reminder');
    Route::get('/configuracion/responsables-sap', [SapOwnerUserController::class, 'index'])->name('sap-owner-users.index');
    Route::post('/configuracion/responsables-sap', [SapOwnerUserController::class, 'store'])->name('sap-owner-users.store');
    Route::get('/configuracion/motivos-objecion-facturas', [PurchaseInvoiceObjectionReasonController::class, 'index'])->name('purchase-invoice-objection-reasons.index');
    Route::post('/configuracion/motivos-objecion-facturas', [PurchaseInvoiceObjectionReasonController::class, 'store'])->name('purchase-invoice-objection-reasons.store');
    Route::put('/configuracion/motivos-objecion-facturas/{reason}', [PurchaseInvoiceObjectionReasonController::class, 'update'])->name('purchase-invoice-objection-reasons.update');

    // Exit Permits - accessible by admin role OR notification email users
    Route::get('admin/permisos-salida', [AdminExitPermitController::class, 'index'])->name('admin.exit-permits.index');
    Route::get('admin/permisos-salida/{exit_permit}', [AdminExitPermitController::class, 'show'])->name('admin.exit-permits.show');
    Route::patch('admin/permisos-salida/{exit_permit}/status', [AdminExitPermitController::class, 'updateStatus'])->name('admin.exit-permits.update-status');

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
        Route::get('organizational-units/import', [OrganizationalUnitController::class, 'importForm'])->name('organizational-units.import');
        Route::post('organizational-units/import', [OrganizationalUnitController::class, 'importCsv'])->name('organizational-units.import-csv');
        Route::resource('organizational-units', OrganizationalUnitController::class)->except(['show']);
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

        // Gestión de roles Spatie
        Route::get('admin/roles', [RoleController::class, 'index'])->name('admin.roles.index');
        Route::put('admin/roles/{user}', [RoleController::class, 'update'])->name('admin.roles.update');
        Route::put('admin/roles/{user}/password', [RoleController::class, 'updatePassword'])->name('admin.roles.update-password');

        // ========== MÓDULO ATS ==========
        // Dashboard ATS
        Route::get('/ats', [AtsDashboardController::class, 'index'])->name('ats.dashboard');
        Route::get('/ats/export', [AtsDashboardController::class, 'export'])->name('ats.export');

        // Vacantes
        Route::resource('ats/vacancies', VacancyController::class)->names('ats.vacancies');
        Route::put('ats/vacancies/{vacancy}/restore', [VacancyController::class, 'restore'])->name('ats.vacancies.restore');

        // Pipeline de vacantes (configurar etapas)
        Route::get('ats/vacancies/{vacancy}/pipeline', [VacancyStageController::class, 'index'])->name('ats.vacancies.pipeline');
        Route::post('ats/vacancies/{vacancy}/pipeline', [VacancyStageController::class, 'store'])->name('ats.vacancies.pipeline.store');
        Route::put('ats/vacancies/{vacancy}/pipeline/reorder', [VacancyStageController::class, 'reorder'])->name('ats.vacancies.pipeline.reorder');
        Route::delete('ats/vacancies/{vacancy}/pipeline/{stageId}', [VacancyStageController::class, 'destroy'])->name('ats.vacancies.pipeline.destroy');

        // Tablero Kanban
        Route::get('ats/vacancies/{vacancy}/kanban', [ApplicationController::class, 'kanban'])->name('ats.applications.kanban');
        Route::post('ats/applications', [ApplicationController::class, 'store'])->name('ats.applications.store');
        Route::patch('ats/applications/{application}/move', [ApplicationController::class, 'move'])->name('ats.applications.move');
        Route::patch('ats/applications/{application}/hire', [ApplicationController::class, 'hire'])->name('ats.applications.hire');
        Route::delete('ats/applications/{application}', [ApplicationController::class, 'destroy'])->name('ats.applications.destroy');

        // Candidatos
        Route::resource('ats/candidates', CandidateController::class)->names('ats.candidates');

        // Entrevistas
        Route::resource('ats/interviews', InterviewController::class)->names('ats.interviews');
        Route::get('ats/applications/{application}/interviews', [InterviewController::class, 'index'])->name('ats.application-interviews.index');
        Route::get('ats/applications/{application}/interviews/create', [InterviewController::class, 'create'])->name('ats.application-interviews.create');

        // Evaluaciones
        Route::resource('ats/evaluations', EvaluationController::class)->names('ats.evaluations');
        Route::get('ats/interviews/{interview}/evaluations', [EvaluationController::class, 'index'])->name('ats.interview-evaluations.index');
        Route::get('ats/interviews/{interview}/evaluations/create', [EvaluationController::class, 'create'])->name('ats.interview-evaluations.create');

        // Etapas globales (solo admin/RRHH)
        Route::resource('ats/stages', StageController::class)->names('ats.stages');
        Route::put('ats/stages/reorder', [StageController::class, 'reorder'])->name('ats.stages.reorder');

        // Activity API endpoints (JSON responses, same session auth)
        Route::get('api/user-activities', [UserActivityController::class, 'index']);
        Route::get('api/user-activities/stats', [UserActivityController::class, 'stats']);
        Route::get('api/user-activities/export', [UserActivityController::class, 'export']);
        Route::get('api/admin/user-activities', [UserActivityController::class, 'adminIndex']);
        Route::get('api/admin/user-activities/stats', [UserActivityController::class, 'adminStats']);
        Route::get('api/admin/user-activities/export', [UserActivityController::class, 'adminExport']);
        Route::get('api/admin/user-activities/{user}', [UserActivityController::class, 'adminUserDetail']);
    });
});

// Auth routes are handled by Laravel\Fortify
