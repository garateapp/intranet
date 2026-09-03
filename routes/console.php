<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// Resumen semanal de facturas pendientes: lunes a las 23:00 hora de Santiago de Chile
Schedule::command('purchase-invoices:weekly-summary')
    ->weekly()
    ->mondays()
    ->at('23:00')
    ->timezone('America/Santiago');
