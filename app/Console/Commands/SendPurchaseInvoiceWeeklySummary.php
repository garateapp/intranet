<?php

namespace App\Console\Commands;

use App\Enums\PurchaseInvoiceApprovalStatus;
use App\Enums\PurchaseInvoiceResponsibleStatus;
use App\Jobs\SendWeeklyInvoiceSummary;
use App\Models\PurchaseInvoiceApproval;
use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class SendPurchaseInvoiceWeeklySummary extends Command
{
    protected $signature = 'purchase-invoices:weekly-summary';

    protected $description = 'Envía un resumen semanal (lunes 23:00 Santiago) con las facturas pendientes por vencer en los próximos 11 días';

    private const DUE_DAYS = 11;

    public function handle(): int
    {
        $threshold = today()->addDays(self::DUE_DAYS)->endOfDay();

        $approvalsQuery = PurchaseInvoiceApproval::query()
            ->where('estado_aprobacion', PurchaseInvoiceApprovalStatus::Pending->value)
            ->where('factura_canceled', '!=', 'Y')
            ->whereNotNull('factura_vencimiento')
            ->where('factura_vencimiento', '<=', $threshold);

        // Cargar facturas con sus responsables activos
        $approvals = $approvalsQuery
            ->with(['lines', 'activeResponsibles' => fn ($q) => $q->where('estado', PurchaseInvoiceResponsibleStatus::Pending->value)])
            ->get();

        // Agrupar ids de facturas por usuario responsable (efectivo: suplente → manual → SAP)
        $byUser = [];
        foreach ($approvals as $approval) {
            $effectiveUser = $approval->substitute_user_id
                ?? $approval->manual_responsible_user_id
                ?? $approval->activeResponsibles->whereNotNull('user_id')->first()?->user_id;

            if ($effectiveUser) {
                $byUser[$effectiveUser][] = $approval->id;
            }
        }

        // Notificar a los responsables
        $queued = 0;
        foreach ($byUser as $userId => $invoiceIds) {
            SendWeeklyInvoiceSummary::dispatch($userId, $invoiceIds);
            $queued++;
        }

        // Notificar también a los cobradores (resumen global) si hay facturas
        if ($approvals->isNotEmpty()) {
            $cobradores = User::role('cobrador')->get();
            foreach ($cobradores as $cobrador) {
                SendWeeklyInvoiceSummary::dispatch($cobrador->id, $approvals->pluck('id')->all());
                $queued++;
            }
        }

        Log::info('Resumen semanal de facturas encolado.', [
            'invoice_count' => $approvals->count(),
            'emails_queued' => $queued,
        ]);

        $this->info("Facturas pendientes por vencer: {$approvals->count()}");
        $this->info("Correos de resumen encolados: {$queued}");

        return self::SUCCESS;
    }
}
