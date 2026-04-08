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
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Public routes
Route::get('/', [DashboardController::class, 'welcome'])->name('welcome');
Route::get('/noticia/{post:slug}', [PostController::class, 'show'])->name('posts.show');

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

    // Profile
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Logout
    Route::post('/logout', [GoogleAuthController::class, 'logout'])->name('logout');

    // Admin-only resource routes
    Route::middleware(['admin'])->group(function () {
        Route::resource('posts', PostController::class);
        Route::resource('categories', CategoryController::class);
        Route::resource('links', LinkController::class);
        Route::resource('settings', SettingController::class)->except(['show']);

        // Portal admin routes
        Route::resource('users', UserDirectoryAdminController::class)->only(['index', 'edit', 'update']);
        Route::resource('faq-categories', FaqCategoryController::class);
        Route::resource('faqs', FaqController::class);
        Route::resource('corporate-events', CorporateEventController::class);
    });
});

require __DIR__.'/auth.php';
