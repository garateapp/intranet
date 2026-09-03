<?php

namespace App\Console\Commands;

use App\Enums\PurchaseInvoiceApprovalStatus;
use App\Enums\PurchaseInvoiceResponsibleStatus;
use App\Jobs\SendPurchaseInvoiceWorkflowEmail;
use App\Models\PurchaseInvoiceApprovalResponsible;
use App\Models\PurchaseInvoiceReminder;
use Illuminate\Console\Command;

class SendPurchaseInvoiceReminders extends Command
{
    protected $signature = 'purchase-invoices:send-reminders';

    protected $description = 'Encola recordatorios únicos para facturas pendientes por 24, 48 y 72 horas';

    public function handle(): int
    {
        $queued = 0;

        PurchaseInvoiceApprovalResponsible::query()
            ->where('active', true)
            ->whereNotNull('user_id')
            ->where('estado', PurchaseInvoiceResponsibleStatus::Pending->value)
            ->whereHas('approval', fn ($query) => $query
                ->where('estado_aprobacion', PurchaseInvoiceApprovalStatus::Pending->value)
                ->where('factura_canceled', '!=', 'Y'))
            ->with('approval')
            ->chunkById(100, function ($responsibles) use (&$queued): void {
                foreach ($responsibles as $responsible) {
                    $age = (int) $responsible->approval->fecha_primera_sincronizacion->diffInHours(now());
                    foreach ([24, 48, 72] as $threshold) {
                        if ($age < $threshold) {
                            continue;
                        }

                        $reminder = PurchaseInvoiceReminder::firstOrCreate([
                            'purchase_invoice_approval_responsible_id' => $responsible->id,
                            'threshold_hours' => $threshold,
                        ], ['purchase_invoice_approval_id' => $responsible->purchase_invoice_approval_id]);

                        if ($reminder->wasRecentlyCreated) {
                            SendPurchaseInvoiceWorkflowEmail::dispatch(
                                $responsible->purchase_invoice_approval_id,
                                $responsible->user_id,
                                SendPurchaseInvoiceWorkflowEmail::TYPE_REMINDER,
                                $reminder->id,
                            );
                            $queued++;
                        }
                    }
                }
            });

        $this->info("Recordatorios encolados: {$queued}");

        return self::SUCCESS;
    }
}
